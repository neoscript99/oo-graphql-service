import React from 'react'
import { observer } from 'mobx-react';
import { EntityPageList } from '../EntityPageList';
import { AdminPageProps } from './AdminRequiredServices';
import { commonColumns } from '../../utils';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { EntityColumnProps } from '../EntityList';

const columns: EntityColumnProps[] = [
  { title: '标题', dataIndex: 'title' },
  { title: '内容', dataIndex: 'content' },
  { title: '附件数', dataIndex: 'attachNum' },
  commonColumns.lastUser,
  commonColumns.lastUpdated,
];


export class Note extends EntityPageList<AdminPageProps> {

  get columns(): EntityColumnProps[] {
    return columns
  }

  get domainService(): DomainService<MobxDomainStore> {
    return this.props.services.noteService;
  }
}
