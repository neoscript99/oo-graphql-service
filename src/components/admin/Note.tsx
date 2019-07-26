import React, { ReactNode } from 'react'
import { observer } from 'mobx-react';
import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { EntityPageList } from '../EntityPageList';
import { AdminPageProps } from './AdminRequiredServices';
import { commonColumns } from '../../utils';
import { Entity } from '../../DomainStore';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';

const columns: Array<ColumnProps<Entity>> = [
  { title: '标题', dataIndex: 'title' },
  { title: '内容', dataIndex: 'content' },
  { title: '附件数', dataIndex: 'attachNum' },
  commonColumns.lastUser,
  commonColumns.lastUpdated,
];


@observer
export class Note extends EntityPageList<AdminPageProps> {

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
    return this.props.services.noteService;
  }
}
