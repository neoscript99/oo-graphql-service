import React from 'react';
import { AdminPageProps } from '../AdminRequiredServices';
import { commonColumns } from '../../../utils';
import { EntityPageList, EntityColumnProps } from '../../layout';
import { DomainService } from '../../../DomainService';
import { MobxDomainStore } from '../../../mobx';
import { UserForm } from './UserForm';

const columns: EntityColumnProps[] = [
  { title: '姓名', dataIndex: 'name' },
  { title: '帐号', dataIndex: 'account' },
  { title: '所属机构', dataIndex: 'dept.name' },
  commonColumns.enabled,
  commonColumns.editable,
  commonColumns.lastUpdated,
];

export class UserList extends EntityPageList<AdminPageProps> {
  constructor(props: AdminPageProps) {
    if (!props.formComponent) props.formComponent = UserForm;
    super(props);
  }

  get domainService(): DomainService<MobxDomainStore> {
    return this.props.services.userService;
  }

  get columns(): EntityColumnProps[] {
    return columns;
  }
}
