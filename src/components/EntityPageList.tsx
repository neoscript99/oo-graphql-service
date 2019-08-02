import React from 'react'
import { Tag } from 'antd';
import { PaginationConfig, TableProps } from 'antd/lib/table';
import { EntityListState, EntityList } from './EntityList';
import { Entity } from '../DomainStore';
import { ListResult } from '../DomainGraphql';
import { fromPageInfo, toPageInfo } from '../utils';

export abstract class EntityPageList<P = any, S extends EntityListState = EntityListState>
  extends EntityList<P, S> {

  pagination: PaginationConfig = {
    pageSize: this.defaultPageSize,
    onChange: this.pageChange.bind(this),
    onShowSizeChange: this.pageSizeChange.bind(this),
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => <Tag color="blue">总记录数：{total}</Tag>
  }
  tableProps: TableProps<Entity> = {
    loading: false, pagination: this.pagination
  }

  pageChange(page: number, pageSize?: number): void {
    this.pagination.current = page;
    this.query()
  }

  pageSizeChange(current: number, size: number): void {
    this.pagination.pageSize = size
    this.pagination.current = 1;
    this.query()
  }

  query(): Promise<ListResult> {
    console.debug(`${this.className}.query:${this.toString()}`);
    const promise = this.domainService.listPage({
      ...this.queryParam,
      pageInfo: toPageInfo(this.pagination)
    })
    this.updateTableProps(promise)
    return promise;
  }

}
