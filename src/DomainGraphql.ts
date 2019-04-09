import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';

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

  list(domain, fields, criteria): Promise<ListResult>;

  get(domain: string, fields: string, id: string): Promise<any>;

  create(domain, fields, value): Promise<any>;

  update(domain, fields, id, value): Promise<any>;

  delete(domain, id): Promise<DeleteResult>;

  getFields(typeName: string): Promise<string>;

  getFields(typeName: string, level: number, maxLevel: number): Promise<string>;

  getType(type): Promise<any>;
}
