import React from 'react'
import { AdminPageProps } from './AdminRequiredServices';
import { commonColumns } from '../../utils';
import { EntityPageList } from '../EntityPageList';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { EntityColumnProps } from '../EntityList';

const columns: EntityColumnProps[] = [
  { title: '参数代码', dataIndex: 'code' },
  { title: '参数名称', dataIndex: 'name' },
  { title: '参数类型', dataIndex: 'type.name' },
  { title: '参数值', dataIndex: 'value' },
  { title: '修改人', dataIndex: 'lastUser.name' },
  commonColumns.lastUpdated];


export class Param extends EntityPageList<AdminPageProps> {

  get columns(): EntityColumnProps[] {
    return columns
  }

  get domainService(): DomainService<MobxDomainStore> {
    return this.props.services.paramService;
  }
}
