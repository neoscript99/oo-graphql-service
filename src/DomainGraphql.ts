// eslint-disable-next-line import/no-named-as-default
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import upperFirst from 'lodash/upperFirst';
import { pureGraphqlObject } from './utils/graphqlUtil';
import { Entity } from './DomainStore';

declare let JSON: {
  stringify: (v: any) => string;
};

//排序支持传字段名列表，或者字段名+顺序类型
export type CriteriaOrder = string | [string, 'asc' | 'desc'];

export interface Criteria {
  and?: Criteria;
  or?: Criteria;
  eq?: [string, any][];
  like?: [string, any][];
  ilike?: [string, any][];
  ge?: [string, any][];
  gt?: [string, any][];
  le?: [string, any][];
  lt?: [string, any][];
  between?: [string, any, any][];
  eqProperty?: [string, string][];
  in?: [string, any[]][];
  notIn?: [string, any[]][];
  isEmpty?: [string][];
  isNotEmpty?: [string][];
  isNull?: [string][];
  isNotNull?: [string][];
  max?: number;
  offset?: number;
  order?: CriteriaOrder[];

  [key: string]: number | any[] | Criteria | undefined; //嵌套查询
}

export interface ListResult {
  results: Entity[];
  totalCount: number;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export interface DefaultFetchVariables {
  token: string;
}

const defaultFetchVariables: DefaultFetchVariables = { token: 'init' };
/**
 * 和gorm后台框架交互的graphql服务类
 */
export class DomainGraphql {
  /**
   *
   * @param defaultVariables graphql客户端的默认参数
   * @param {ApolloClient<NormalizedCacheObject>} apolloClient 客户端
   */
  constructor(
    public apolloClient: ApolloClient<NormalizedCacheObject>,
    public defaultVariables: DefaultFetchVariables = defaultFetchVariables,
  ) {}

  //fetchPolicy
  //@see https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-config-options-fetchPolicy
  list(domain: string, fields: string, criteria: Criteria): Promise<ListResult> {
    console.debug('Graphql.list', domain, criteria);
    return this.apolloClient
      .query<{ [key: string]: ListResult }>({
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
          ...this.defaultVariables,
          criteria: JSON.stringify(criteria),
        },
      })
      .then(data => data.data[`${domain}List`]);
  }

  get(domain: string, fields: string, id: string): Promise<Entity> {
    console.debug('Graphql.get', domain, id);
    return this.apolloClient
      .query<{ [key: string]: any }>({
        query: gql`
                query ${domain}Get($id:String!){
                  ${domain}(id:$id){
                    ${fields}
                  }
                }`,
        fetchPolicy: 'no-cache',
        variables: {
          ...this.defaultVariables,
          id,
        },
      })
      .then(data => data.data[domain]);
  }

  create(domain: string, fields: string, value: Entity): Promise<Entity> {
    console.debug('Graphql.create', domain, value);
    return this.apolloClient
      .mutate<{ [key: string]: Entity }>({
        mutation: gql`
                mutation ${domain}CreateMutate($${domain}:${upperFirst(domain)}Create){
                  ${domain}Create(${domain}:$${domain}){
                    ${fields}
                  }
                }`,
        fetchPolicy: 'no-cache',
        variables: {
          ...this.defaultVariables,
          [domain]: value,
        },
      })
      .then(data => data.data![`${domain}Create`]);
  }

  update(domain: string, fields: string, id: any, value: Entity): Promise<Entity> {
    console.debug('Graphql.update', domain, id, value);
    // version 被配置为 @JsonIgnoreProperties ，如果传入会导致Null异常
    // todo 但没有version也有缺陷，无法规避本地修改的对象已经被别人修改这种情况，如有类似需求再做优化
    // 其它属性如果传入会导致graphql校验异常
    const { id: removeId, version, ...updateValue } = pureGraphqlObject(value);
    return this.apolloClient
      .mutate<{ [key: string]: Entity }>({
        mutation: gql`
                mutation ${domain}UpdateMutate($id:String!, $${domain}:${upperFirst(domain)}Update){
                  ${domain}Update(id:$id, ${domain}:$${domain}){
                    ${fields}
                  }
                }`,
        fetchPolicy: 'no-cache',
        variables: {
          ...this.defaultVariables,
          [domain]: updateValue,
          id,
        },
      })
      .then(data => data.data![`${domain}Update`]);
  }

  delete(domain: string, id: any): Promise<DeleteResult> {
    console.debug('Graphql.delete', domain, id);
    return this.apolloClient
      .mutate<{ [key: string]: DeleteResult }>({
        mutation: gql`
                mutation ${domain}DeleteMutate($id:String!){
                  ${domain}Delete(id:$id){
                    success
                    error
                  }
                }`,
        fetchPolicy: 'no-cache',
        variables: {
          ...this.defaultVariables,
          id,
        },
      })
      .then(data => data.data![`${domain}Delete`]);
  }

  async getFields(typeName: string, level = 0, maxLevel = 6): Promise<string> {
    if (level >= maxLevel) return Promise.resolve('');

    console.debug('Graphql.getFields', typeName);
    const type = await this.getType(typeName);
    if (!(type && type.data && type.data.__type)) {
      console.error(`服务端没有这个Graphql类型：${typeName}`);
      return Promise.reject(`服务端没有这个Graphql类型：${typeName}`);
    }
    const fields = type.data.__type.fields;
    const acc: string[] = [];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      let nestType = null;
      //LIST类型，仅取Error，其它忽略
      if (field.type.kind === 'LIST')
        /*if (field.type.ofType.name === 'Error')
        nestType = 'Error';
      else
        continue;*/
        nestType = field.type.ofType.name;
      else if (['INTERFACE', 'OBJECT'].includes(field.type.kind)) nestType = field.type.name;

      if (nestType) {
        const nestFields = await this.getFields(nestType, level + 1, maxLevel);
        if (nestFields.length > 0) acc.push(`${field.name}{${nestFields}}`);
      } else acc.push(field.name);
    }
    return acc.join(',');
  }

  getType(type: string): Promise<any> {
    return this.apolloClient.query({
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
        ...this.defaultVariables,
        type,
      },
    });
  }
}
