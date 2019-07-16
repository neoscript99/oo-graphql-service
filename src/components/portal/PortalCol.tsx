import React, { Component } from 'react';
import { Col } from 'antd';
import { inject, observer } from 'mobx-react';
import { DomainService, Entity, MobxDomainStore } from '../../';
import { PortletSwitch, PortletMap } from './';
import {PortletDataSourceService} from '../../services/';

interface P {
  col: Entity
  customerPortletMap: PortletMap
  portletColRelService?: DomainService<MobxDomainStore>
  portletDataSourceService?: PortletDataSourceService
}

@inject('portletColRelService', 'portletDataSourceService')
@observer
export class PortalCol extends Component<P> {
  render() {
    const { col, customerPortletMap, portletColRelService, portletDataSourceService } = this.props;
    if (!portletColRelService || !portletDataSourceService || !portletColRelService.store.allList)
      return null;
    return (
      <Col {...JSON.parse(col.exColProps)} style={JSON.parse(col.style)} order={col.colOrder} span={col.span}>
        {portletColRelService.store.allList.filter(rel => rel.col.id === col.id)
          .map(rel =>
            <PortletSwitch key={rel.portlet.id} portlet={rel.portlet} portletMap={customerPortletMap}
                           portletDataSourceService={portletDataSourceService} />)}
      </Col>
    );
  }
}
