import fetch from 'node-fetch';
import gql from 'graphql-tag';
import {
  createApolloClient,
  DomainGraphql,
  MobxDomainStore,
  DomainService,
} from '../src';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';

const uri = 'http://localhost:8080/graphql';
const token = 'gorm-dev-token'
const defaultVariables = { token };
const apolloClient: ApolloClient<NormalizedCacheObject> = createApolloClient(uri, fetch)
const domainGraphql: DomainGraphql = new DomainGraphql(apolloClient, defaultVariables);
const userService = new DomainService('user', MobxDomainStore, domainGraphql);
const deptService = new DomainService('department', MobxDomainStore, domainGraphql);
const portletColRelService = new DomainService('portletColRel', MobxDomainStore, domainGraphql);

describe('GraphqlStore CURD', () => {
  it('user list and get', async () => {
    //嵌套属性排序，目前gorm不支持，可能是用了DetachedCriteria的原因，原来做客户经理考核的时候好像是支持的
    const data = await userService.listAll({ pageInfo: { pageSize: 2 }, orders: ['dept.seq', 'name'] })

    expect(data)
      .not
      .toBeNull()
    expect(data.totalCount)
      .toBeGreaterThan(0);
    expect(await userService.get(data.results[0].id))
      .toHaveProperty('name')
  });

  it('department create and update and delete', async () => {
    let department = await deptService.create({ name: 'GraphqlStoreTest', seq: 999, enabled: false })
    expect(department.seq)
      .toEqual(999)
    department = await deptService.update(department.id, { seq: 888 })
    expect(department.seq)
      .toEqual(888)

    expect(await deptService.delete(department.id)
      .then(data => data && data.success))
      .toEqual(true)
  });

  it('menu tree', async () => {
    const token = 'gorm-dev-token'
    const res = await domainGraphql.getFields('MenuNode')
      .then(fields => {
        console.debug(fields)
        return apolloClient.query<{ [key: string]: any }>({
          query: gql`query menuTree {
                        menuTree {
                        ${fields}
                      }}`,
          variables: { token }
        })
      })
    console.debug(res.data.menuTree)
    expect(res.data.menuTree.menu.label)
      .toEqual('Root')
  })

  it('interface test', async () => {
    const data = await portletColRelService.listAll({ orders: ['portletOrder'] })
    console.log(data.results[0])
    expect(data.totalCount)
      .toEqual(11)
  })
})
;

