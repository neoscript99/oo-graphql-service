import gql from 'graphql-tag';
import { sha256 } from 'js-sha256'
import { message } from 'antd';
import { Entity } from '../DomainStore';
import { DomainService } from '../DomainService';
import { MobxDomainStore } from '../mobx';
import { DomainGraphql } from '../DomainGraphql';

export interface UserEntity extends Entity {
  account: string
  name?: string
  dept?: any
}

export interface LoginInfo {
  success: boolean
  token: string
  user?: UserEntity
  casAccount?: string
  error?: string
}

export interface AfterLogin {
  (loginInfo: LoginInfo): void
}

const USERNAME_KEY = 'loginUsername'
const PASSWORD_KEY = 'loginPassword'

export class UserService extends DomainService<MobxDomainStore> {

  constructor(private afterLogin: AfterLogin, domainGraphql: DomainGraphql) {
    super('user', MobxDomainStore, domainGraphql);
    this.changeCurrentItem({})
  }

  login(username: string, password: string, remember: boolean = false): Promise<LoginInfo> {
    return this.loginHash(username, sha256(password), remember)
  }

  loginHash(username: string, passwordHash: string, remember: boolean = false): Promise<LoginInfo> {
    return this.domainGraphql.apolloClient.mutate<{ login: LoginInfo }>({
      mutation: gql`mutation loginAction {
                      login(username: "${username}", password: "${passwordHash}") {
                        success
                        error
                        token
                        user{
                          id, account, name      
                        }
                      }
                    }`,
      fetchPolicy: 'no-cache',
      variables: {
        ...this.domainGraphql.defaultVariables
      }
    })
      .then(data => {
        const loginInfo = data.data!.login
        if (loginInfo.success) {
          this.afterLogin(loginInfo)
          this.changeCurrentItem(loginInfo.user as Entity)
          if (remember)
            this.saveLoginInfoLocal(username, passwordHash)
        } else {
          message.info(loginInfo.error);
          this.clearLoginInfoLocal();
        }
        return loginInfo
      })
  }

  tryLocalLogin() {
    const info = this.getLoginInfoLocal()
    if (info.username && info.password)
      this.loginHash(info.username, info.password)
  }

  saveLoginInfoLocal(username: string, password: string) {
    localStorage.setItem(USERNAME_KEY, username)
    localStorage.setItem(PASSWORD_KEY, password)
  }

  clearLoginInfoLocal() {
    localStorage.removeItem(USERNAME_KEY)
    localStorage.removeItem(PASSWORD_KEY)
  }

  getLoginInfoLocal() {
    return {
      username: localStorage.getItem(USERNAME_KEY),
      password: localStorage.getItem(PASSWORD_KEY)
    }
  }

  casLogin(): Promise<LoginInfo> {
    return this.domainGraphql.apolloClient.mutate<{ casLogin: LoginInfo }>({
      mutation: gql`mutation casLoginAction {
                      casLogin {
                        success
                        error
                        token
                        user{
                          id, account, name      
                        }
                        casAccount
                      }
                    }`,
      fetchPolicy: 'no-cache',
      variables: {
        ...this.domainGraphql.defaultVariables
      }
    })
      .then(data => {
        const loginInfo = data.data!.casLogin
        if (loginInfo.success) {
          this.afterLogin(loginInfo)
          this.changeCurrentItem(loginInfo.user ? loginInfo.user : { account: loginInfo.casAccount })
        } else {
          message.info(loginInfo.error);
        }
        return loginInfo
      })
  }

  devLogin(account: string, token: string) {
    this.changeCurrentItem({ account, token })
    this.afterLogin({ user: { account }, token, success: true })
  }
}
