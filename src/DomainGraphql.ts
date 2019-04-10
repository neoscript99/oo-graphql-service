import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';

export declare type Criteria = {
  and?: Criteria,
  or?: Criteria,
  eq?: [[string, string]],
  like?: [[string, string]],
  ilike?: [[string, any]],
  ge?: [[string, any]],
  gt?: [[string, any]],
  le?: [[string, any]],
  lt?: [[string, any]],
  between?: [[string, any, any]],
  eqProperty?: [[string, string]],
  in?: [[string, [any]]],
  notIn?: [[string, [any]]],
  isEmpty?: [[string]],
  isNotEmpty?: [[string]],
  isNull?: [[string]],
  isNotNull?: [[string]],
  [key: string]: any,
}

export declare type ListResult = {
  results: Array<any>
  totalCount: number
}

export declare type DeleteResult = {
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
