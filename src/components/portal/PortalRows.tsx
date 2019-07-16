import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Row } from 'antd';
import { clearEntity } from '../../utils/graphqlUtil';
import { PortalCol } from './';
import { PortletMap } from './PortletSwitch';
import { DomainService, MobxDomainStore, Entity } from '../../';

interface P {
  portal: Entity
  customerPortletMap: PortletMap
  portalRowRelService: DomainService<MobxDomainStore>
}

@inject('portalRowRelService')
@observer
export class PortalRows extends React.Component<P> {

  render() {
    const { portal, customerPortletMap, portalRowRelService } = this.props;
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
            .map((col: Entity) => <PortalCol key={col.id} col={col} customerPortletMap={customerPortletMap} />)
        }
      </Row>)}
    </Fragment>
  }
}
