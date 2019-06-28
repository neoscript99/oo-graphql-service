import ApolloClient from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';

import MobxDomainStore from './mobx/MobxDomainStore';
import DomainGraphql, { Criteria, CriteriaOrder, DeleteResult, ListResult } from './DomainGraphql'
import DomainStore, { Entity } from './DomainStore'
import DomainService, { ListOptions } from './DomainService'
import { toFetch } from './ooGrahpqlMobxUtils'

function createApolloClient(fetchParams: BatchHttpLink.Options): ApolloClient<NormalizedCacheObject> {
  //WEB环境用浏览器原生fetch
  const link = new BatchHttpLink(fetchParams);
  const cache = new InMemoryCache();
  return new ApolloClient({ link, cache });
}

export {
  Entity,
  DomainGraphql,
  DomainStore,
  DomainService,
  MobxDomainStore,
  ListOptions,
  ListResult,
  DeleteResult,
  Criteria,
  CriteriaOrder,
  toFetch,
  createApolloClient
}
