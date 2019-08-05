import React from 'react'
import { AdminPageProps } from './AdminRequiredServices';
import { commonColumns } from '../../utils';
import { EntityPageList } from '../EntityPageList';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { EntityColumnProps } from '../EntityList';

const columns: EntityColumnProps[] = [
  { title: '姓名', dataIndex: 'name' },
  { title: '帐号', dataIndex: 'account' },
  { title: '所属机构', dataIndex: 'dept.name' },
  commonColumns.enabled,
  commonColumns.editable,
  commonColumns.lastUser,
  commonColumns.lastUpdated,
];


export class User extends EntityPageList<AdminPageProps> {
  constructor(props: AdminPageProps) {
    super(props);
    this.tableProps.pagination.pageSize = 2;
  }

  get domainService(): DomainService<MobxDomainStore> {
    return this.props.services.userService;
  }

  get columns(): EntityColumnProps[] {
    return columns
  }
}
