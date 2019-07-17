import React, { ReactNode } from 'react';
import { Button } from 'antd';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { Portlet } from './Portlet';

export class PortletLink extends Portlet {

  render(): ReactNode {
    if (!this.state || !this.state.portlet)
      return null
    const { linkUrl, portletName } = this.state.portlet
    return <Button type="primary" icon="link" size='large' style={{ height: '6rem' }}
                   onClick={() => window.open(linkUrl, '_blank')}>
      {portletName}
    </Button>
  }

  get portletService(): DomainService<MobxDomainStore> {
    return this.props.services.portletLinkService;
  }
}

