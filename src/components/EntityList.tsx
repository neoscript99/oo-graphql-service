import React, { Component } from 'react'
import { getClassName } from '../utils/langUtil';
import { Entity } from '../DomainStore';
import { DomainService, ListOptions } from '../DomainService';
import { MobxDomainStore } from '../mobx';
import { ListResult } from '../DomainGraphql';
import { PaginationConfig, TableProps } from 'antd/lib/table';
import { Tag } from 'antd';
import { fromPageInfo, toPageInfo } from '../utils';

export interface EntityListState {
  tableProps?: TableProps<Entity>
}

export abstract class EntityList<P = any, S extends EntityListState = EntityListState>
  extends Component<P, S> {
  //这里配置的是前台分页信息，展示所有数据
  pagination: PaginationConfig = {
    pageSize: this.defaultPageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => <Tag color="blue">总记录数：{total}</Tag>
  }
  tableProps: TableProps<Entity> = {
    loading: false, pagination: this.pagination
  }
  uuid = new Date();

  abstract get domainService(): DomainService<MobxDomainStore>;

  query(): Promise<ListResult> {
    console.debug(`${this.className}.query:${this.toString()}`);
    const p = this.domainService.listAll(this.queryParam)
    this.updateTableProps(p)
    return p
  }

  updateTableProps(promise: Promise<any>): void {
    this.tableProps.loading = true
    this.updateState()
    promise.then((data: ListResult) => {
      this.pagination.total = data.totalCount
      return data
    })
      .finally(() => {
        this.tableProps.loading = false
        this.updateState()
      })
  }

  componentDidMount(): void {
    const { store } = this.domainService;
    if (store.needRefresh) {
      this.query();
      store.needRefresh = false;
    } else {
      this.restoreState()
      this.updateState()
    }
  }

  restoreState() {
    Object.assign(this.pagination, fromPageInfo(this.domainService.store.pageInfo))
  }

  protected updateState(): void {
    this.setState({ tableProps: this.tableProps })
  }

  protected get queryParam(): ListOptions {
    return {
      criteria: {},
      orders: [['lastUpdated', 'desc',]]
    };
  }

  toString() {
    return this.uuid
  }

  get className() {
    return getClassName(this)
  }

  get defaultPageSize() {
    return 8
  }

  pageChange(page: number, pageSize?: number): void {
    this.pagination.current = page;
    this.domainService.store.pageInfo = toPageInfo(this.pagination)
  }

  pageSizeChange(current: number, size: number): void {
    this.pagination.pageSize = size
    this.pagination.current = 1;
    this.domainService.store.pageInfo = toPageInfo(this.pagination)
  }
}
