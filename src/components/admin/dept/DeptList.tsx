import React from 'react';
import { AdminPageProps } from '../AdminServices';
import { commonColumns, StringUtil } from '../../../utils';
import { EntityList, EntityColumnProps, SimpleSearchForm } from '../../layout';
import { ListOptions } from '../../../DomainService';
import { DeptForm } from './DeptForm';

const columns: EntityColumnProps[] = [
  { title: '序号', dataIndex: 'seq' },
  { title: '机构名', dataIndex: 'name' },
  commonColumns.enabled,
  commonColumns.lastUpdated,
];

export class DeptList extends EntityList<AdminPageProps> {
  constructor(props: AdminPageProps) {
    super(props);
  }
  get domainService() {
    return this.props.services.deptService;
  }
  get columns() {
    return columns;
  }
  getEntityForm() {
    return DeptForm;
  }
  getSearchForm() {
    return DeptSearchForm;
  }
  getQueryParam(): ListOptions {
    const param: ListOptions = {
      orders: ['seq'],
    };
    const { searchParam } = this.domainService.store;
    if (searchParam && StringUtil.isNotBlank(searchParam.searchKey)) {
      const key = `${searchParam.searchKey}%`;
      param.criteria = { like: [['name', key]] };
    }
    return param;
  }
}

export class DeptSearchForm extends SimpleSearchForm {
  placeholder = '名称、帐号';
}
