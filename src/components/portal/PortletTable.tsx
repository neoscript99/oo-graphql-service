import React from 'react';
import { Card, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { Portlet, PortletProps, PortletState } from './Portlet';
import { Entity } from '../../DomainStore';
import { commonColumnRenders, commonSortFunctions } from '../../utils';

export interface PortletColumnProps extends ColumnProps<Entity> {
  renderFun?: string
  sortFun?: string
}

export interface PortletTableState extends PortletState {
  columns: PortletColumnProps[]
}

export class PortletTable extends Portlet<PortletProps, PortletTableState> {

  render() {
    if (!(this.state && this.state.portlet))
      return null

    const { portlet: table, dataList } = this.state
    const columns: PortletColumnProps[] = table.columns && JSON.parse(table.columns)
    columns.forEach(col => {
      col.render = col.renderFun && commonColumnRenders[col.renderFun]
      col.sorter = col.sortFun && commonSortFunctions[col.sortFun].bind(null, col.dataIndex)
    })
    return (
      <Card title={table.portletName} style={this.props.style}>
        <Table dataSource={dataList} columns={columns}
               rowKey={table.rowKey}
               pagination={{ pageSize: table.pageSize }} bordered />
      </Card>
    )
  }

  get portletService(): DomainService<MobxDomainStore> {
    return this.props.services.portletTableService;
  }
}
