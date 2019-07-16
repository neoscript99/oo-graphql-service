import React from 'react';
import { Card, Icon } from 'antd'
import { PortletListView, PortletCalendar, PortletTab, PortletLink, PortletTable, PortletProps } from './';

const defaultPortalMap: PortletMap = { PortletLink, PortletTable, PortletListView, PortletCalendar, PortletTab }

export interface PortletMap {
  [key: string]: React.ComponentType<PortletProps>
}

export interface PortletSwitchProps extends PortletProps {
  inTab?: boolean
  portletMap?: PortletMap
}


export const PortletSwitch = (props: PortletSwitchProps) => {
  return <div style={{ marginBottom: '0.5rem' }}>
    < a id={props.portlet.id} />
    <PortletMapping {...props} />
  </div>
}


const PortletMapping = ({ portlet, portletMap, inTab, portletDataSourceService }: PortletSwitchProps) => {
    const map = { ...defaultPortalMap, ...portletMap };
    if (map[portlet.type]) {
      const Portlet = map[portlet.type];
      return <Portlet portlet={portlet} inTab={inTab} portletDataSourceService={portletDataSourceService} />
    } else
      return <NotExists portlet={portlet} portletDataSourceService={portletDataSourceService} />
  }
;

const NotExists = ({ portlet }: PortletProps) =>
  <Card title={portlet.portletName} actions={
    [<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]
  }>
    <Card.Meta
      avatar={<Icon type="close" style={{ color: 'red', fontSize: '2rem' }} />}
      title='控件不存在，请联系管理员'
      description={portlet.type}
    />
  </Card>
