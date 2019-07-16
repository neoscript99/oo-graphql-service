import React from 'react';
import { DomainService, MobxDomainStore, Portlet, PortletProps, PortletSwitch } from '../../';
import { inject, observer } from 'mobx-react';
import { Card, Tabs } from 'antd';


const { TabPane } = Tabs;

interface P extends PortletProps {
  portletTabRelService: DomainService<MobxDomainStore>
}

@inject('portletTabRelService', 'portletDataSourceService')
@observer
export class PortletTab extends Portlet {

  async componentDidMount() {
    const res = await this.props.portletTabRelService.listAll({
      criteria: { eq: [['tab.id', this.props.portlet.id]] },
      orders: ['portletOrder']
    })
    this.setState({ portletList: res.results.map(rel => rel.portlet) })
  }

  render() {
    if (!(this.state && this.state.portletList))
      return null

    const { portletList } = this.state
    return (
      <Card>
        <Tabs>
          {portletList.map(ptl => <TabPane tab={ptl.portletName} key={ptl.id}>
            <PortletSwitch key={ptl.id} portlet={ptl} inTab={true}
                           portletDataSourceService={this.props.portletDataSourceService} />
          </TabPane>)}
        </Tabs>
      </Card>
    )
  }

  get portletService(): DomainService<MobxDomainStore> | null {
    return null;
  }
}
