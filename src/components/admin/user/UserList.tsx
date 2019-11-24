import React from 'react';
import { AdminPageProps } from '../AdminServices';
import { commonColumns } from '../../../utils';
import { EntityPageList, EntityColumnProps, SimpleSearchForm, EntityFormProps } from '../../layout';
import { DomainService } from '../../../DomainService';
import { MobxDomainStore } from '../../../mobx';
import { UserForm, UserFormProps } from './UserForm';
import { Entity } from '../../../DomainStore';
import { DeptEntity } from '../../../services/DeptService';

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
    (props as UserFormProps).deptList = this.props.services.deptService.store.allList as DeptEntity[];
    return props;
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
}

export class UserSearchForm extends SimpleSearchForm {
  placeholder = '名称、帐号';
}
