import React, { Component, ReactNode } from 'react'
import { getClassName } from '../utils/langUtil';
import { Entity } from '../DomainStore';
import { DomainService, ListOptions } from '../DomainService';
import { MobxDomainStore } from '../mobx';
import { ListResult } from '../DomainGraphql';
import { ColumnProps, PaginationConfig, TableProps, TableRowSelection } from 'antd/lib/table';
import { Button, message, Table, Tag } from 'antd';
import { fromPageInfo, toPageInfo } from '../utils';
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form';

export interface EntityListState {
  selectedRowKeys?: any[]
  dataList?: Entity[]
  formProps?: EntityFormProps
}

export interface EntityTableProps extends TableProps<Entity> {
  pagination: PaginationConfig
  rowSelection: TableRowSelection<Entity>;
}

export interface EntityColumnProps extends ColumnProps<Entity> {

}

export interface EntityFormProps extends FormComponentProps {
  title: string
  okText: string
  domainService: DomainService<MobxDomainStore>
  item: Entity
}

/**
 * EntityList的pagination配置的是前台分页信息，展示所有数据
 */
export abstract class EntityList<P = any, S extends EntityListState = EntityListState>
  extends Component<P, S> {
  tableProps: EntityTableProps = {
    loading: false,
    rowKey: 'id',
    rowSelection: {
      onChange: this.onSelectChange.bind(this),
      hideDefaultSelections: true
    },
    bordered: true,
    pagination: {
      pageSize: 10,
      current: 1,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => <Tag color="blue">总记录数：{total}</Tag>,
      onChange: this.pageChange.bind(this),
      onShowSizeChange: this.pageSizeChange.bind(this),
    }
  }
  uuid = new Date();


  render() {
    if (!this.state)
      return null;
    const { selectedRowKeys } = this.state;
    const selectedNum = selectedRowKeys ? selectedRowKeys.length : 0;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon='plus-circle' style={{ marginRight: 6 }}>
            新增
          </Button>
          <Button type="primary" disabled={selectedNum !== 1} icon="edit" style={{ marginRight: 6 }}>
            修改
          </Button>
          <Button type="primary" disabled={selectedNum === 0} icon='delete' style={{ marginRight: 6 }}>
            删除
          </Button>
        </div>
        <Table dataSource={this.state.dataList}
               columns={this.columns}
               {...this.tableProps}>
        </Table>
      </div>)
  }

  abstract get domainService(): DomainService<MobxDomainStore>;

  abstract get columns(): EntityColumnProps[];

  query(): Promise<ListResult> {
    console.debug(`${this.className}.query:${this.toString()}`);
    const p = this.domainService.listAll(this.queryParam)
    this.updateTableProps(p)
    return p
  }

  updateTableProps(promise: Promise<any>): void {
    this.tableProps.loading = true
    this.forceUpdate()
    promise.then((data: ListResult) => {
      this.tableProps.pagination.total = data.totalCount
      this.setState({ dataList: data.results })
      this.updateStorePageInfo()
      return data
    })
      .catch(e => {
        message.info(`查询出错：${e}`);
        throw(e)
      })
      .finally(() => {
        this.tableProps.loading = false
        this.forceUpdate()
      })
  }

  componentDidMount(): void {
    this.setState({ selectedRowKeys: [] })
    const { store } = this.domainService;
    if (store.needRefresh) {
      this.query();
      store.needRefresh = false;
    } else {
      this.restoreState()
    }
  }

  restoreState() {
    const { pageInfo, allList } = this.domainService.store
    Object.assign(this.tableProps.pagination, fromPageInfo(pageInfo))
    this.setState({ dataList: allList })
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


  pageChange(page: number, pageSize?: number): void {
    this.tableProps.pagination.current = page;
    this.forceUpdate()
    this.updateStorePageInfo()
  }

  pageSizeChange(current: number, size: number): void {
    this.tableProps.pagination.pageSize = size
    this.tableProps.pagination.current = 1;
    this.forceUpdate()
    this.updateStorePageInfo()
  }

  updateStorePageInfo() {
    this.domainService.syncPageInfo(toPageInfo(this.tableProps.pagination))
  }

  onSelectChange(selectedRowKeys) {
    this.tableProps.rowSelection.selectedRowKeys = selectedRowKeys;
    this.setState({ selectedRowKeys });
  };

}
