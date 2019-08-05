import React from 'react'
import { EntityListState, EntityList } from './EntityList';
import { ListResult } from '../DomainGraphql';
import { fromPageInfo } from '../utils';

export abstract class EntityPageList<P = any, S extends EntityListState = EntityListState>
  extends EntityList<P, S> {

  pageChange(page: number, pageSize?: number): void {
    super.pageChange(page, pageSize)
    this.query()
  }

  pageSizeChange(current: number, size: number): void {
    super.pageSizeChange(current, size)
    this.query()
  }

  query(): Promise<ListResult> {
    console.debug(`${this.className}.query:${this.toString()}`);
    const promise = this.domainService.listPage({
      ...this.queryParam
    })
    this.updateTableProps(promise)
    return promise;
  }

  restoreState() {
    const { pageInfo, pageList } = this.domainService.store
    Object.assign(this.tableProps.pagination, fromPageInfo(pageInfo))
    this.setState({ dataList: pageList })
  }
}
