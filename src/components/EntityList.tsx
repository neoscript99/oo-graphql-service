import React, { Component } from 'react'
import { getClassName } from '../utils/langUtil';
import { Entity } from '../DomainStore';
import { DomainService, ListOptions } from '../DomainService';
import { MobxDomainStore } from '../mobx';
import { ListResult } from '../DomainGraphql';
import { ColumnProps, PaginationConfig, TableProps, TableRowSelection } from 'antd/lib/table';
import { Button, Form, message, Popconfirm, Table, Tag } from 'antd';
import { fromPageInfo, toPageInfo } from '../utils';
import { EntityForm, EntityFormProps } from './EntityForm';
import { FormWrappedProps } from 'antd/lib/form/interface';

export interface EntityListProps {
  name: string
  formComponent?: React.ComponentType<EntityFormProps>
}

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
  initValue?: any
}

/**
 * EntityList的pagination配置的是前台分页信息，展示所有数据
 */
export abstract class EntityList<P extends EntityListProps = EntityListProps, S extends EntityListState = EntityListState>
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
    //@ts-ignore
    const FormComponent = EntityForm.formWrapper(this.props.formComponent || EntityForm)

    const { selectedRowKeys, formProps, dataList } = this.state;
    const selectedNum = selectedRowKeys ? selectedRowKeys.length : 0;
    return (
      <div>
        {formProps && FormComponent && <FormComponent {...formProps} />}
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon='plus-circle' style={{ marginRight: 6 }}
                  onClick={this.handleCreate}>
            新增
          </Button>
          <Button type="primary" disabled={selectedNum !== 1} icon="edit" style={{ marginRight: 6 }}
                  onClick={this.handleUpdate}>
            修改
          </Button>

          <Popconfirm
            title="确定删除所选记录吗?"
            onConfirm={this.handleDelete}
            okText="确定"
            cancelText="取消"
            disabled={selectedNum === 0}
          >
            <Button type="primary" disabled={selectedNum === 0} icon='delete' style={{ marginRight: 6 }}>
              删除
            </Button>
          </Popconfirm>
        </div>
        <Table dataSource={dataList}
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


  handleCreate = () => {
    this.setState({
      formProps: this.getFormProps('新增')
    })
  }

  handleUpdate = () => {
    const { selectedRowKeys, dataList } = this.state;
    if (!selectedRowKeys || !dataList)
      return;
    const id = selectedRowKeys[0];
    const item = dataList.find(v => v.id === id)
    if (item)
      this.setState({
        formProps: this.getFormProps('修改', item)
      })
  }

  handleDelete = () => {
    const { selectedRowKeys } = this.state;
    selectedRowKeys && Promise.all(selectedRowKeys.map(id => this.domainService.delete(id)))
      .then(results => {
        const errorResults = results.filter(res => !res.success)
        if (errorResults.length > 0)
          message.error(errorResults.map(res => res.error))
        else
          message.success('删除成功')
        this.query()
      })
  }

  handleFormSuccess = (item: Entity) => {
    this.pageChange(1)
    this.setState({ formProps: undefined })
    this.query()
  }

  handleFormCancel = () => {
    this.setState({ formProps: undefined })
  }

  handleFormError(reason: any) {
    const notWork = <div>
      <h2>保存失败：</h2>
      <blockquote>{reason}</blockquote>
    </div>
    message.error(`保存失败：${reason}`)
  }

  getFormProps(action: string, item?: Entity): EntityFormProps {
    //@ts-ignore
    return {
      title: `${action}${this.props.name}`,
      okText: action,
      domainService: this.domainService,
      onSuccess: this.handleFormSuccess,
      onCancel: this.handleFormCancel,
      onError: this.handleFormError,
      columns: this.columns,
      item
    }
  }
}
