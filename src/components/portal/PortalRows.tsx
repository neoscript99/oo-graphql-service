import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
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
}

@observer
export class PortalRows extends React.Component<P> {

  render() {
    const { portal, customerPortletMap, services: { portalRowRelService } } = this.props;
    if (!portalRowRelService.store.allList)
      return null;
    const relList = portalRowRelService.store.allList
      .filter(value => value.portal.id === portal.id)

    return <Fragment>
      {relList.map(rel => <Row {...clearEntity(rel.row, 'rowName', 'rowOrder', 'cols')} key={rel.id}>
        {
          rel.row.cols
            .slice()
            .sort((a: Entity, b: Entity) => a.colOrder - b.colOrder)
            .map((col: Entity) => <PortalCol key={col.id} col={col} customerPortletMap={customerPortletMap}
                                             services={this.props.services} />)
        }
      </Row>)}
    </Fragment>
  }
}
