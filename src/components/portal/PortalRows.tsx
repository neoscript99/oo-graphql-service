import React, { Fragment } from 'react';
import { Row } from 'antd';
import { clearEntity } from '../../utils/graphqlUtil';
import { PortalCol } from './PortalCol';
import { PortletMap } from './PortletSwitch';
import { Entity } from '../../DomainStore';
import { PortalRequiredServices } from './PortalRequiredServices';

interface P {
  portal: Entity
  customerPortletMap: PortletMap
  services: PortalRequiredServices
  portalRowRelAllList: Entity[]
  portletColRelAllList: Entity[]
}

export class PortalRows extends React.Component<P> {

  render() {
    const { portal, customerPortletMap, portalRowRelAllList, portletColRelAllList } = this.props;
    const relList = portalRowRelAllList
      .filter(value => value.portal.id === portal.id)

    return <Fragment>
      {relList.map(rel => <Row {...clearEntity(rel.row, 'rowName', 'rowOrder', 'cols')} key={rel.id}>
        {
          rel.row.cols
            .slice()
            .sort((a: Entity, b: Entity) => a.colOrder - b.colOrder)
            .map((col: Entity) => <PortalCol key={col.id} col={col} customerPortletMap={customerPortletMap}
                                             services={this.props.services}
                                             portletColRelAllList={portletColRelAllList} />)
        }
      </Row>)}
    </Fragment>
  }
}
