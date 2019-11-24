import React from 'react'
import { AdminPageProps } from './AdminServices';
import { booleanLabel, timeFormater } from '../../utils';
import { EntityColumnProps, EntityList } from '../layout';
import { MobxDomainStore } from '../../mobx';
import { DomainService, ListOptions } from '../../DomainService';

const columns: EntityColumnProps[] = [
  { title: '角色名', dataIndex: 'roleName' },
  { title: '角色代码(unique)', dataIndex: 'roleCode' },
  { title: '启用', dataIndex: 'enabled', render: booleanLabel },
  { title: '可编辑', dataIndex: 'editable', render: booleanLabel },
  { title: '描述', dataIndex: 'description' },
  { title: '修改时间', dataIndex: 'lastUpdated', render: timeFormater }];

export class Role extends EntityList<AdminPageProps> {
  constructor(props: AdminPageProps) {
    super(props);
    this.tableProps.pagination.pageSize = 6;
  }

  get domainService(): DomainService<MobxDomainStore> {
    return this.props.services.roleService;
  }

  protected get queryParam(): ListOptions {
    return { orders: [['lastUpdated', 'desc']] };
  }
  get columns(): EntityColumnProps[] {
    return columns
  }
}

