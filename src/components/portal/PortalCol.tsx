import React, { Component } from 'react';
import { Col } from 'antd';
import { PortletSwitch, PortletMap } from './PortletSwitch';
import { Entity } from '../../DomainStore';
import { observer } from 'mobx-react';
import { PortalRequiredServices } from './PortalRequiredServices';

interface P {
  col: Entity
  customerPortletMap: PortletMap
  services: PortalRequiredServices
}

@observer
export class PortalCol extends Component<P> {
  render() {
    const { col, customerPortletMap, services: { portletColRelService } } = this.props;
    if (!portletColRelService.store.allList)
      return null;
    return (
      <Col {...JSON.parse(col.exColProps)} style={JSON.parse(col.style)} order={col.colOrder} span={col.span}>
        {portletColRelService.store.allList.filter(rel => rel.col.id === col.id)
          .map(rel =>
            <PortletSwitch key={rel.portlet.id} portlet={rel.portlet} portletMap={customerPortletMap}
                           services={this.props.services} />)}
      </Col>
    );
  }
}
