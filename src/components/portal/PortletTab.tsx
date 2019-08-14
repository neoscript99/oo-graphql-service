import React from 'react';
import { Card, Tabs } from 'antd';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { Portlet, PortletProps, PortletState } from './Portlet';
import { PortletSwitch } from './PortletSwitch';
import { CardTabListType } from 'antd/lib/card';
import { Entity } from '../../DomainStore';


const { TabPane } = Tabs;
const defaultState = { portletList: [] }

interface S extends PortletState {
  portletList: Entity[]
  tabList?: CardTabListType[]
  activePortlet?: Entity
}

export class PortletTab extends Portlet<PortletProps, S> {

  componentDidMount() {
    this.props.services.portletTabRelService.listAll({
      criteria: { eq: [['tab.id', this.props.portlet.id]] },
      orders: ['portletOrder']
    })
      .then(res => {
        const portletList = res.results.map(rel => rel.portlet)
        const tabList = portletList.map(p => ({ key: p.id, tab: p.portletName }));
        const activePortlet = portletList.length > 0 && portletList[0]
        this.setState({ portletList, tabList, activePortlet })
      })
  }

  handleTabChange = (key: string) => {
    const { portletList } = this.state
    const activePortlet = portletList.find(p => p.id === key)
    this.setState({ activePortlet })
  }

  render() {
    const { style } = this.props;
    const { tabList, activePortlet } = this.state || defaultState
    return (
      <Card style={style} tabList={tabList} onTabChange={this.handleTabChange}
            activeTabKey={activePortlet && activePortlet.id}>
        {activePortlet && <PortletSwitch key={activePortlet.id}
                                         portlet={activePortlet} inTab={true}
                                         services={this.props.services} />
        }
      </Card>
    )
  }

  get portletService(): DomainService<MobxDomainStore> | null {
    return null;
  }
}
