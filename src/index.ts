import ApolloClient from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';

import MobxDomainStore from './mobx/MobxDomainStore';
import DomainGraphql, { Criteria } from './DomainGraphql'
import DomainGraphqlGorm from './DomainGraphqlGorm'
import DomainStore from './DomainStore'
import DomainService, { ListOptions } from './DomainService'
import { toFetch } from './ooGrahpqlMobxUtils'

function createApolloClient({ uri, fetch = null }): ApolloClient<NormalizedCacheObject> {
  //WEB环境用浏览器原生fetch
  const link = new BatchHttpLink(fetch ? { uri, fetch } : { uri });
  const cache = new InMemoryCache();
  return new ApolloClient({ link, cache });
}

export {
  DomainGraphql,
  DomainStore,
  DomainService,
  DomainGraphqlGorm,
  MobxDomainStore,
  Criteria,
  ListOptions,
  toFetch,
  createApolloClient
}
