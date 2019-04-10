import fetch from 'node-fetch';
import gql from 'graphql-tag';
import {
  createApolloClient,
  DomainGraphqlGorm,
  DomainGraphql,
  MobxDomainStore,
  DomainService,
  DomainStore,
} from '../src';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';

const uri = 'http://localhost:8080/graphql';
const token = 'gorm-dev-token'
const defaultVariables = { token };
const apolloClient: ApolloClient<NormalizedCacheObject> = createApolloClient({ uri, fetch })
const domainGraphql: DomainGraphql = new DomainGraphqlGorm(apolloClient, defaultVariables);
const userStore: DomainStore = new MobxDomainStore();
const deptStore: DomainStore = new MobxDomainStore();
const userService = new DomainService('user', userStore, domainGraphql);
const deptService = new DomainService('department', deptStore, domainGraphql);

describe('GraphqlStore CURD', () => {
  it('user list and get', () => {
    userService.listAll({ max: 2 })
      .then(data => {
        expect(data)
          .not
          .toBeNull()
        if (data) {
          expect(data.totalCount)
            .toBeGreaterThan(0);
          expect(userService.get(data.results[0].id))
            .toHaveProperty('name')
        }
      })
  });

  it('department create and update and delete', () => {
    deptService.create({ name: 'GraphqlStoreTest', seq: 999, enabled: false })
      .then(
        department => {
          expect(department.seq)
            .toEqual(999)
          expect(deptService.update(department.id, { seq: 888 })
            .then(data => data.seq))
            .toEqual(888)
          expect(deptService.delete(department.id)
            .then(data => data && data.success))
            .toEqual(true)
          deptService.delete(department.id)
        }
      )
  });

  it('menu tree', () => {
    const token = 'gorm-dev-token'
    domainGraphql.getFields('MenuNode')
      .then(fields => {
        console.debug(fields)
        return apolloClient.query<{ [key: string]: any }>({
          query: gql`query menuTree {
                        menuTree(token: "${token}") {
                        ${fields}
                      }}`,
          variables: { token }
        })
      })
      .then(res => console.debug(res.data.menuTree))
  })
});

