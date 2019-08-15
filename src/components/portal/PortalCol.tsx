import React, { Component } from 'react';
import { Col } from 'antd';
import { PortletSwitch, PortletMap } from './PortletSwitch';
import { Entity } from '../../DomainStore';
import { PortalRequiredServices } from './PortalRequiredServices';

interface P {
  col: Entity
  customerPortletMap: PortletMap
  services: PortalRequiredServices
  portletColRelAllList: Entity[]
}

export class PortalCol extends Component<P> {
  render() {
    const { col, customerPortletMap, portletColRelAllList } = this.props;
    return (
      <Col {...JSON.parse(col.exColProps)} style={JSON.parse(col.style)} order={col.colOrder} span={col.span}>
        {portletColRelAllList.filter(rel => rel.col.id === col.id)
          .map(rel =>
            <PortletSwitch key={rel.portlet.id} portlet={rel.portlet} portletMap={customerPortletMap}
                           services={this.props.services} />)}
      </Col>
    );
  }
}
