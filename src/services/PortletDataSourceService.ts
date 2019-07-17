import gql from 'graphql-tag';
import { LivebosObject, transLivebosData } from './LivebosServerService';
import { DomainService } from '../DomainService';
import { MobxDomainStore } from '../mobx';
import { Entity } from '../DomainStore';

export interface DataResult {
  //列表结果
  dataList?: any[]
  //单个对象结果
  dataItem?: any
}

export class PortletDataSourceService extends DomainService<MobxDomainStore> {

  getData(portletDataSource: Entity): Promise<DataResult> {
    return this.domainGraphql.apolloClient.query<{ getPortletData: string }>({
      query: gql`query getPortletDataQuery{
                  getPortletData(dataSourceId: "${portletDataSource.id}")
                }`,
      fetchPolicy: 'no-cache',
      variables: {
        ...this.domainGraphql.defaultVariables
      }
    })
      .then(data => {
        const jsonData = JSON.parse(data.data.getPortletData);
        if (portletDataSource.type === 'LivebosQuery')
          return transLivebosData(jsonData as LivebosObject)
        return { dataList: jsonData }
      })
  }
}
