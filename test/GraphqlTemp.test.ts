import fetch from 'node-fetch';
import {
  createApolloClient,
  DomainGraphql,
} from '../src';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';

const uri = 'http://localhost:8080/graphql';
const token = 'gorm-dev-token'
const defaultVariables = { token };
const apolloClient: ApolloClient<NormalizedCacheObject> = createApolloClient({
  uri,
  fetch: (fetch as any) as GlobalFetch['fetch']
})
const domainGraphql: DomainGraphql = new DomainGraphql(apolloClient, defaultVariables);

describe('Graphql temp test', () => {
  it('get Fields', async () => {
    const res = await domainGraphql.getFields('PortletTable')
    console.log(res);
  })
})
;

