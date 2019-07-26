import React, { ReactNode } from 'react'
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { observer } from 'mobx-react';
import { AdminPageProps } from './AdminRequiredServices';
import { Entity } from '../../DomainStore';
import { booleanLabel, timeFormater } from '../../utils';
import { EntityList } from '../EntityList';
import { MobxDomainStore } from '../../mobx';
import { DomainService, ListOptions } from '../../DomainService';

const columns: Array<ColumnProps<Entity>> = [
  { title: '角色名', dataIndex: 'roleName' },
  { title: '角色代码(unique)', dataIndex: 'roleCode' },
  { title: '启用', dataIndex: 'enabled', render: booleanLabel },
  { title: '可编辑', dataIndex: 'editable', render: booleanLabel },
  { title: '描述', dataIndex: 'description' },
  { title: '修改时间', dataIndex: 'lastUpdated', render: timeFormater }];

@observer
export class Role extends EntityList<AdminPageProps> {

  render(): ReactNode {
    return (
      <Table dataSource={this.domainService.store.allList}
             columns={columns}
             bordered
             rowKey='id'
             {...this.tableProps}>
      </Table>)
  }

  get domainService(): DomainService<MobxDomainStore> {
    return this.props.services.roleService;
  }

  protected get queryParam(): ListOptions {
    return { orders: [['lastUpdated', 'desc']] };
  }
}

