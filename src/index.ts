import ApolloClient from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import MobxStore from './mobx/MobxStore';
import DomainGraphql from './DomainGraphql'
import DomainGraphqlGorm from './DomainGraphqlGorm'
import DomainStore from './DomainStore'
import DomainService from './DomainService'
import MessageStore from './MessageStore'
import MobxMessageStore from './mobx/MobxMessageStore';
import { toFetch } from './ooGrahpqlMobxUtils'

function createApolloClient({ uri, fetch = null }) {
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
  MessageStore,
  MobxMessageStore,
  MobxStore,
  toFetch,
  createApolloClient
}
