import React from 'react';
import {
  DomainService,
  Entity,
  MobxDomainStore,
  Portlet,
  PortletProps,
  PortletState,
  commonColumnRenders,
  commonSortFunctions
} from '../../';
import { inject } from 'mobx-react';
import { Card, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';

export interface PortletColumnProps extends ColumnProps<Entity> {
  renderFun?: string
  sortFun?: string
}

export interface PortletTableState extends PortletState {
  columns: PortletColumnProps[]
}

@inject('portletTableService')
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
      <Card title={table.portletName}>
        <Table dataSource={dataList} columns={columns}
               rowKey={table.rowKey}
               pagination={{ pageSize: table.pageSize }} bordered />
      </Card>
    )
  }

  get portletService(): DomainService<MobxDomainStore> {
    return this.props.portletTableService;
  }
}
