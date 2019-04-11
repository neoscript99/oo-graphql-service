import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';

//排序支持传字段名列表，或者字段名+顺序类型
export type CriteriaOrder = string | [string, 'asc' | 'desc']

export interface Criteria {
  and?: Criteria
  or?: Criteria
  eq?: [string, any][]
  like?: [string, any][]
  ilike?: [string, any][]
  ge?: [string, any][]
  gt?: [string, any][]
  le?: [string, any][]
  lt?: [string, any][]
  between?: [[string, any, any]]
  eqProperty?: [string, string][]
  in?: [string, any[]][]
  notIn?: [string, any[]][]
  isEmpty?: [string][]
  isNotEmpty?: [string][]
  isNull?: [string][]
  isNotNull?: [string][]
  max?: number
  offset?: number
  order?: CriteriaOrder[]

  [key: string]: any
}

export interface ListResult {
  results: Array<any>
  totalCount: number
}

export interface DeleteResult {
  success: boolean
  error?: string
}

/**
 * 和后台graphql框架交互的服务接口
 */
export default interface DomainGraphql {
  apolloClient: ApolloClient<NormalizedCacheObject>
  defaultVariables: any

  list(domain: string, fields: string, criteria: Criteria): Promise<ListResult>;

  get(domain: string, fields: string, id: any): Promise<any>;

  create(domain: string, fields: string, value: any): Promise<any>;

  update(domain: string, fields: string, id: any, value: any): Promise<any>;

  delete(domain: string, id: any): Promise<DeleteResult>;

  getFields(typeName: string): Promise<string>;

  getFields(typeName: string, level: number, maxLevel: number): Promise<string>;

  getType(type: string): Promise<any>;
}
