import React from 'react';
import { AdminPageProps } from '../AdminServices';
import { StringUtil } from '../../../utils';
import { EntityColumnProps, EntityPageList, SimpleSearchForm } from '../../layout';
import { MobxDomainStore } from '../../../mobx';
import { DomainService, ListOptions } from '../../../DomainService';

const columns: EntityColumnProps[] = [
  { title: '姓名', dataIndex: 'user.name' },
  { title: '帐号', dataIndex: 'user.account' },
  { title: '所属机构', dataIndex: 'user.dept.name' },
  { title: '角色名', dataIndex: 'role.roleName' },
  { title: '角色代码(unique)', dataIndex: 'role.roleCode' },
];

export class UserRoleList extends EntityPageList<AdminPageProps> {
  constructor(props: AdminPageProps) {
    super(props);
  }

  get domainService(): DomainService<MobxDomainStore> {
    return this.props.services.userRoleService;
  }

  get columns(): EntityColumnProps[] {
    return columns;
  }
  getQueryParam(): ListOptions {
    const param = { criteria: {}, orders: ['user'] };
    const { searchParam } = this.domainService.store;
    if (searchParam && StringUtil.isNotBlank(searchParam.searchKey)) {
      const key = `${searchParam.searchKey}%`;
      (param.criteria as any).or = {
        role: { like: [['roleName', key]] },
        user: { or: { like: [['name', key], ['account', key]] } },
      };
    }
    return param;
  }

  getSearchForm() {
    return UserRoleSearchForm;
  }
}

export class UserRoleSearchForm extends SimpleSearchForm {
  placeholder = '姓名、帐号、角色名';
}
