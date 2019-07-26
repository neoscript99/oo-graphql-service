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
  { title: '参数代码', dataIndex: 'code' },
  { title: '参数名称', dataIndex: 'name' },
  { title: '参数类型', dataIndex: 'type.name' },
  { title: '参数值', dataIndex: 'value' },
  { title: '修改人', dataIndex: 'lastUser.name' },
  commonColumns.lastUpdated];


@observer
export class Param extends EntityPageList<AdminPageProps> {

  render(): ReactNode {
    return (
      <Table dataSource={this.domainService.store.pageList}
             columns={columns}
             bordered
             {...this.tableProps}
             rowKey='id'>
      </Table>)
  }

  get domainService(): DomainService<MobxDomainStore> {
    return this.props.services.paramService;
  }
}
