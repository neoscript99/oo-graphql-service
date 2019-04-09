// eslint-disable-next-line import/no-named-as-default
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import upperFirst from 'lodash/upperFirst';
import { pureGraphqlObject } from './ooGrahpqlMobxUtils';
import DomainGraphql, { DeleteResult, ListResult } from './DomainGraphql';

declare var JSON: {
  stringify: (any) => string
};

/**
 * 和gorm后台框架交互的graphql服务类
 */
class GormGraphql implements DomainGraphql {

  /**
   *
   * @param defaultVariables graphql客户端的默认参数
   * @param {ApolloClient<NormalizedCacheObject>} client 客户端
   */
  constructor(private defaultVariables: any = {}, private client: ApolloClient<NormalizedCacheObject>) {
  }

  //fetchPolicy
  //@see https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-config-options-fetchPolicy
  list(domain, fields, criteria = null): Promise<ListResult> {
    console.debug('Graphql.list', domain, criteria);
    if (typeof criteria !== 'string')
      criteria = JSON.stringify(criteria);
    return this.client.query<{ [key: string]: ListResult }>({
      query: gql`
                query ${domain}ListQuery($criteria:String){
                  ${domain}List(criteria:$criteria){
                        results {
                          ${fields}
                        }
                        totalCount
                  }
                }`,
      fetchPolicy: 'no-cache',
      variables: {
        ...this.defaultVariables, criteria
      }
    })
      .then(data => data.data[`${domain}List`]);
  }

  get(domain: string, fields: string, id: string): Promise<any> {
    console.debug('Graphql.get', domain, id);
    return this.client.query<{ [key: string]: any }>({
      query: gql`
                query ${domain}Get($id:String!){
                  ${domain}(id:$id){
                    ${fields}
                  }
                }`,
      fetchPolicy: 'no-cache',
      variables: {
        ...this.defaultVariables, id
      }
    })
      .then(data => data.data[domain]);
  }

  create(domain, fields, value): Promise<any> {
    console.debug('Graphql.create', domain, value);
    return this.client.mutate({
      mutation: gql`
                mutation ${domain}CreateMutate($${domain}:${upperFirst(domain)}Create){
                  ${domain}Create(${domain}:$${domain}){
                    ${fields}
                  }
                }`,
      fetchPolicy: 'no-cache',
      variables: {
        ...this.defaultVariables, [domain]: value
      }
    })
      .then(data => data.data[`${domain}Create`]);
  }

  update(domain, fields, id, value): Promise<any> {
    console.debug('Graphql.update', domain, id, value);
    // version 被配置为 @JsonIgnoreProperties ，如果传入会导致Null异常
    // todo 但没有version也有缺陷，无法规避本地修改的对象已经被别人修改这种情况，如有类似需求再做优化
    // 其它属性如果传入会导致graphql校验异常
    const { id: removeId, version, ...updateValue } = pureGraphqlObject(value);
    return this.client.mutate({
      mutation: gql`
                mutation ${domain}UpdateMutate($id:String!, $${domain}:${upperFirst(domain)}Update){
                  ${domain}Update(id:$id, ${domain}:$${domain}){
                    ${fields}
                  }
                }`,
      fetchPolicy: 'no-cache',
      variables: {
        ...this.defaultVariables, [domain]: updateValue, id
      }
    })
      .then(data => data.data[`${domain}Update`]);
  }

  delete(domain, id): Promise<DeleteResult> {
    console.debug('Graphql.delete', domain, id);
    return this.client.mutate<{ [key: string]: DeleteResult }>({
      mutation: gql`
                mutation ${domain}DeleteMutate($id:String!){
                  ${domain}Delete(id:$id){
                    success
                    error
                  }
                }`,
      fetchPolicy: 'no-cache',
      variables: {
        ...this.defaultVariables, id
      }
    })
      .then(data => data.data[`${domain}Delete`]);
  }

  async getFields(typeName: string, level: number = 0, maxLevel: number = 6): Promise<string> {
    if (level >= maxLevel)
      return null;
    console.debug('Graphql.getFields', typeName);
    let type = await this.getType(typeName);
    if (!(type && type.data))
      return null;
    let fields = type.data.__type.fields;
    let acc = [];
    for (let i = 0; i < fields.length; i++) {
      let field = fields[i];
      let nestType = null;
      //LIST类型，仅取Error，其它忽略
      if (field.type.kind === 'LIST')
      /*if (field.type.ofType.name === 'Error')
        nestType = 'Error';
      else
        continue;*/
        nestType = field.type.ofType.name;
      else if (field.type.kind === 'OBJECT')
        nestType = field.type.name;

      if (nestType) {
        let nestFields = await this.getFields(nestType, level + 1, maxLevel);
        if (nestFields)
          acc.push(`${field.name}{${nestFields}}`);
      }
      else
        acc.push(field.name);
    }
    return acc.join(',');
  }

  getType(type): Promise<any> {
    return this.client.query({
      query: gql`query ${type}TypeQuery($type:String!){
                  __type(name:$type){
                    fields{
                      name      
                      type {
                        kind
                        name
                        ofType{
                          name
                          kind                          
                        }
                      }
                    }
                  }
                }`,
      variables: {
        ...this.defaultVariables, type
      }
    });
  }
}

export default GormGraphql;
