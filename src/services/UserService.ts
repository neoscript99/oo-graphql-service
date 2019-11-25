import gql from 'graphql-tag';
import { sha256 } from 'js-sha256';
import { message } from 'antd';
import { Entity } from '../DomainStore';
import { DomainService } from '../DomainService';
import { DomainGraphql } from '../DomainGraphql';
import { UserStore } from '../stores';

export interface UserEntity extends Entity {
  account: string;
  name?: string;
  dept?: any;
}

/**
 * 如果是系统自己认证：user 有 ， account 有
 * 如果接入了cas认证：account 有， user 不一定有
 */
export interface LoginInfo {
  success: boolean;
  token?: string;
  user?: UserEntity;
  account?: string;
  error?: string;
  roles?: string;
}

export interface CasConfig {
  clientEnabled: boolean;
  casServerRoot?: string;
  defaultRoles?: string;
}

export interface AfterLogin {
  (loginInfo: LoginInfo): void;
}

const USERNAME_KEY = 'loginUsername';
const PASSWORD_KEY = 'loginPassword';

export class UserService extends DomainService<UserStore> {
  constructor(private afterLogins: AfterLogin[], domainGraphql: DomainGraphql) {
    super('user', UserStore, domainGraphql);
    this.changeCurrentItem({});
    //cas默认为true，初始化时去获取服务端的配置信息，如果为false，再显示登录界面
    this.getCasConfig();
  }

  login(username: string, password: string, remember = false): Promise<LoginInfo> {
    return this.loginHash(username, sha256(password), remember);
  }

  loginHash(username: string, passwordHash: string, remember = false): Promise<LoginInfo> {
    return this.domainGraphql.apolloClient
      .mutate<{ login: LoginInfo }>({
        mutation: gql`mutation loginAction {
                      login(username: "${username}", password: "${passwordHash}") {
                        success
                        account
                        error
                        token
                        user{
                          id, account, name      
                        }
                        roles
                      }
                    }`,
        fetchPolicy: 'no-cache',
        variables: {
          ...this.domainGraphql.defaultVariables,
        },
      })
      .then(data => {
        const loginInfo = data.data!.login;
        this.store.loginInfo = loginInfo;
        if (loginInfo.success) {
          this.doAfterLogin(loginInfo);
          this.changeCurrentItem(loginInfo.user as Entity);
          if (remember) this.saveLoginInfoLocal(username, passwordHash);
        } else {
          message.info(loginInfo.error);
          this.clearLoginInfoLocal();
        }
        return loginInfo;
      });
  }

  tryLocalLogin() {
    const info = this.getLoginInfoLocal();
    if (info.username && info.password) this.loginHash(info.username, info.password);
  }

  saveLoginInfoLocal(username: string, password: string) {
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(PASSWORD_KEY, password);
  }

  clearLoginInfoLocal() {
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(PASSWORD_KEY);
    this.store.loginInfo = { success: false };
  }

  getLoginInfoLocal() {
    return {
      username: localStorage.getItem(USERNAME_KEY),
      password: localStorage.getItem(PASSWORD_KEY),
    };
  }

  trySessionLogin(): Promise<LoginInfo> {
    return this.domainGraphql.apolloClient
      .mutate<{ sessionLogin: LoginInfo }>({
        mutation: gql`
          mutation sessionLoginAction {
            sessionLogin {
              success
              error
              token
              user {
                id
                account
                name
              }
              account
              roles
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          ...this.domainGraphql.defaultVariables,
        },
      })
      .then(data => {
        const loginInfo = data.data!.sessionLogin;
        this.store.loginInfo = loginInfo;
        if (loginInfo.success) {
          loginInfo.user = loginInfo.user || { account: loginInfo.account || '' };
          this.doAfterLogin(loginInfo);
          this.changeCurrentItem(loginInfo.user);
        } else {
          console.debug(loginInfo.error);
        }
        return loginInfo;
      });
  }

  sessionLogout() {
    this.domainGraphql.apolloClient
      .mutate<{ sessionLogout: any }>({
        mutation: gql`
          mutation sessionLogoutAction {
            sessionLogout {
              success
              error
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          ...this.domainGraphql.defaultVariables,
        },
      })
      .then(data => data.data!.sessionLogout.success || console.warn(data.data!.sessionLogout.error));
  }

  getCasConfig(): Promise<CasConfig> {
    return this.domainGraphql.apolloClient
      .query<{ getCasConfig: CasConfig }>({
        query: gql`
          query getCasConfigQuery {
            getCasConfig {
              clientEnabled
              casServerRoot
              defaultRoles
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          ...this.domainGraphql.defaultVariables,
        },
      })
      .then(data => {
        this.store.casConfig = data.data!.getCasConfig;
        return data.data!.getCasConfig;
      });
  }

  devLogin(account: string, token: string) {
    this.changeCurrentItem({ account, token });
    this.doAfterLogin({ user: { account }, account, token, success: true, roles: 'Public' });
  }

  doAfterLogin(loginInfo: LoginInfo) {
    this.afterLogins.forEach(afterLogin => afterLogin(loginInfo));
  }
}
