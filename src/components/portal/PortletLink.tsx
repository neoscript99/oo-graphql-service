import React, { ReactNode } from 'react';
import { DomainService, MobxDomainStore, Portlet } from '../../';
import { inject } from 'mobx-react';
import { Button } from 'antd';

@inject('portletLinkService')
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
    return this.props.portletLinkService;
  }
}

