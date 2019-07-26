import React, { ReactNode } from 'react'
import { observer } from 'mobx-react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { AdminPageProps } from './AdminRequiredServices';
import { Entity } from '../../DomainStore';
import { commonColumns } from '../../utils';
import { EntityPageList } from '../EntityPageList';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';

const columns: Array<ColumnProps<Entity>> = [
  { title: '姓名', dataIndex: 'name' },
  { title: '帐号', dataIndex: 'account' },
  { title: '所属机构', dataIndex: 'dept.name' },
  commonColumns.enabled,
  commonColumns.editable,
  commonColumns.lastUser,
  commonColumns.lastUpdated,
];


@observer
export class User extends EntityPageList<AdminPageProps> {

  render(): ReactNode {
    const { store } = this.domainService
    return (
      <Table dataSource={store.pageList}
             columns={columns}
             bordered
             {...this.tableProps}
             rowKey='id'>
      </Table>)
  }

  get domainService(): DomainService<MobxDomainStore> {
    return this.props.services.userService;
  }
}
