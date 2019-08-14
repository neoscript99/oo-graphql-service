import React, { Component } from 'react';
import { Entity } from '../../DomainStore';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { PortalRequiredServices } from './PortalRequiredServices';

export interface PortletStyles {
  portletStyle?: React.CSSProperties
  cardBodyStyle?: React.CSSProperties
  tabBarStyle?: React.CSSProperties
}

export interface PortletProps {
  //props中只有基类的基础信息，扩展信息还需单独获得
  portlet: Entity
  inTab?: boolean
  services: PortalRequiredServices
  style?: React.CSSProperties

  [key: string]: any
}

export interface PortletState {
  //state中包含扩展信息
  portlet: Entity
  //列表结果
  dataList?: any[]
  //单个对象结果
  dataItem?: any

  [key: string]: any
}

export abstract class Portlet<P extends PortletProps = PortletProps, S extends PortletState = PortletState> extends Component<P, S> {

  abstract get portletService(): DomainService<MobxDomainStore> | null ;

  componentDidMount() {
    /**
     * state.portlet是实现类包含所有信息，props.portlet只有基类信息
     * @see neo.script.gorm.portal.domain.pt.plet.Portlet
     */
    if (this.portletService)
      this.portletService.get(this.props.portlet.id)
        .then(portlet => this.setState({ portlet }))
    else//保证state中有portlet信息
      this.setState({ portlet: this.props.portlet })

    this.getData();
  }

  getData() {
    if (this.props.portlet.ds)
      this.props.services.portletDataSourceService.getData(this.props.portlet.ds)
        .then(result =>
          this.setState({
            dataList: result && result.dataList
          }))
  }

}

