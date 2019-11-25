import React from 'react';
import { AdminPageProps } from '../AdminServices';
import { booleanLabel, StringUtil, timeFormater } from '../../../utils';
import { EntityColumnProps, EntityList, SimpleSearchForm } from '../../layout';
import { MobxDomainStore } from '../../../mobx';
import { DomainService, ListOptions } from '../../../DomainService';

const columns: EntityColumnProps[] = [
  { title: '角色名', dataIndex: 'roleName' },
  { title: '角色代码(unique)', dataIndex: 'roleCode' },
  { title: '启用', dataIndex: 'enabled', render: booleanLabel },
  { title: '可编辑', dataIndex: 'editable', render: booleanLabel },
  { title: '描述', dataIndex: 'description' },
  { title: '修改时间', dataIndex: 'lastUpdated', render: timeFormater },
];

export class RoleList extends EntityList<AdminPageProps> {
  constructor(props: AdminPageProps) {
    super(props);
  }

  get domainService(): DomainService<MobxDomainStore> {
    return this.props.services.roleService;
  }

  get columns(): EntityColumnProps[] {
    return columns;
  }
  getQueryParam(): ListOptions {
    const param = super.getQueryParam();
    const { searchParam } = this.domainService.store;
    if (searchParam && StringUtil.isNotBlank(searchParam.searchKey)) {
      const key = `${searchParam.searchKey}%`;
      param.criteria = { ilike: [['roleName', key]] };
    }
    return param;
  }

  getSearchForm() {
    return RoleSearchForm;
  }
}

export class RoleSearchForm extends SimpleSearchForm {
  placeholder = '角色名';
}
