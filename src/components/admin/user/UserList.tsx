import React, { Fragment } from 'react';
import { AdminPageProps } from '../AdminServices';
import { commonColumns, StringUtil } from '../../../utils';
import { EntityPageList, EntityColumnProps, SimpleSearchForm, EntityFormProps } from '../../layout';
import { DomainService, ListOptions } from '../../../DomainService';
import { MobxDomainStore } from '../../../mobx';
import { UserForm } from './UserForm';
import { Entity } from '../../../DomainStore';

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
    super(props);
  }

  get domainService(): DomainService<MobxDomainStore> {
    return this.props.services.userService;
  }

  get columns(): EntityColumnProps[] {
    return columns;
  }

  getSelectItem() {
    const item = super.getSelectItem();
    if (item) item.deptId = item.dept.id;
    return item;
  }
  getFormProps(action: string, item?: Entity): Partial<EntityFormProps> {
    const props = super.getFormProps(action, item);
    const { services } = this.props;
    return { ...props, services };
  }
  getInitItem() {
    return { editable: true };
  }

  getOperatorEnable() {
    const base = super.getOperatorEnable();
    return {
      update: base.update && this.getSelectItem()!.editable,
      delete: base.delete && this.getSelectItems().every(item => item.editable),
    };
  }
  getEntityForm() {
    return UserForm;
  }
  getSearchForm() {
    return UserSearchForm;
  }
  getQueryParam(): ListOptions {
    const param = super.getQueryParam();
    const { searchParam } = this.domainService.store;
    if (searchParam && StringUtil.isNotBlank(searchParam.searchKey)) {
      const key = `${searchParam.searchKey}%`;
      param.criteria = { or: { ilike: [['name', key], ['account', key]] } };
    }
    return param;
  }
}

export class UserSearchForm extends SimpleSearchForm {
  placeholder = '名称、帐号';
}
