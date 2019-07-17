import React from 'react';
import { observer } from 'mobx-react';
import { Card, Tabs } from 'antd';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { Portlet, PortletProps } from './Portlet';
import { PortletSwitch } from './PortletSwitch';


const { TabPane } = Tabs;

interface P extends PortletProps {
  portletTabRelService: DomainService<MobxDomainStore>
}

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
                           services={this.props.services} />
          </TabPane>)}
        </Tabs>
      </Card>
    )
  }

  get portletService(): DomainService<MobxDomainStore> | null {
    return null;
  }
}
