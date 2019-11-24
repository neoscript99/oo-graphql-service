import React, { Component } from 'react';
import { Entity } from '../../DomainStore';
import { DomainService, ListOptions } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { ListResult, DeleteResult } from '../../DomainGraphql';
import { ColumnProps, PaginationConfig, TableProps, TableRowSelection } from 'antd/lib/table';
import { message, Table, Tag } from 'antd';
import { fromPageInfo, toPageInfo, getClassName } from '../../utils';
import { EntityForm, EntityFormProps } from './EntityForm';
import { OperatorBar } from './OperatorBar';
import { SearchBar } from './SearchBar';
import { SearchForm, SearchFormProps } from './SearchForm';

export interface OperatorSwitch {
  update?: boolean;
  create?: boolean;
  delete?: boolean;
}

export interface EntityListProps {
  name?: string;
  operatorVisible?: OperatorSwitch;
  searchBarOnTop?: boolean;
}

export interface EntityListState {
  selectedRowKeys?: any[];
  dataList?: Entity[];
  formProps?: Partial<EntityFormProps>;
  searchParam?: any;
}

export interface EntityTableProps extends TableProps<Entity> {
  pagination: PaginationConfig;
  rowSelection: TableRowSelection<Entity>;
}

export interface EntityColumnProps extends ColumnProps<Entity> {
  initValue?: any;
}
/**
 * EntityList不做分页，获取所有数据
 * 但后台max还是限制了1000，所以大于这个记录数不能用EntityList，改用EntityPageList
 * 这里的pagination配置的是前台分页信息
 */
export abstract class EntityList<
  P extends EntityListProps = EntityListProps,
  S extends EntityListState = EntityListState
> extends Component<P, S> {
  tableProps: EntityTableProps = {
    loading: false,
    rowKey: 'id',
    rowSelection: {
      onChange: this.changeSelectRows.bind(this),
      hideDefaultSelections: true,
    },
    bordered: true,
    pagination: {
      pageSize: 10,
      current: 1,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <Tag color="blue">总记录数：{total}</Tag>,
      onChange: this.pageChange.bind(this),
      onShowSizeChange: this.pageSizeChange.bind(this),
    },
  };
  uuid = new Date().toISOString();

  render() {
    if (!this.state) return null;
    const { operatorVisible, searchBarOnTop } = this.props;

    const { dataList } = this.state;
    const searchForm = this.getSearchForm();
    const searchBar = searchForm && (
      <SearchBar
        onSearch={this.handleSearch.bind(this)}
        searchForm={searchForm!}
        searchParam={this.domainService.store.searchParam}
      />
    );
    return (
      <div>
        {this.getEntityFormPop(this.state.formProps)}
        {searchBarOnTop && searchBar}
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.2rem 0' }}>
          <OperatorBar
            onCreate={this.handleCreate.bind(this)}
            onUpdate={this.handleUpdate.bind(this)}
            onDelete={this.handleDelete.bind(this)}
            operatorVisible={operatorVisible}
            operatorEnable={this.getOperatorEnable()}
          />
          {!searchBarOnTop && searchBar}
        </div>
        <Table dataSource={dataList} columns={this.columns} {...this.tableProps}></Table>
      </div>
    );
  }

  abstract get domainService(): DomainService<MobxDomainStore>;

  abstract get columns(): EntityColumnProps[];

  query(): Promise<ListResult> {
    console.debug(`${this.className}(${this.toString()}).query`);
    const p = this.domainService.listAll(this.getQueryParam());
    this.updateTableProps(p);
    return p;
  }

  updateTableProps(promise: Promise<any>): void {
    this.tableProps.loading = true;
    this.forceUpdate();
    promise
      .then((data: ListResult) => {
        this.tableProps.pagination.total = data.totalCount;
        this.updateStorePageInfo();
        this.tableProps.loading = false;
        this.setState({ dataList: data.results });
        return data;
      })
      .catch(e => {
        this.tableProps.loading = false;
        this.forceUpdate();
        message.info(`查询出错：${e}`);
        throw e;
      });
    /*
    chrome对finally的支持暂时还不稳定
    .finally(() => {
      this.tableProps.loading = false
      this.forceUpdate()
    })
    */
  }

  componentDidMount(): void {
    this.setState({ selectedRowKeys: [] });
    const { store } = this.domainService;
    if (store.needRefresh) {
      this.query();
      store.needRefresh = false;
    } else {
      this.restoreState();
    }
  }

  restoreState() {
    const { pageInfo, allList } = this.domainService.store;
    Object.assign(this.tableProps.pagination, fromPageInfo(pageInfo));
    this.setState({ dataList: allList });
  }

  /**
   * 不用get property是因为无法继承
   */
  getQueryParam(): ListOptions {
    return {
      criteria: {},
      orders: [['lastUpdated', 'desc']],
    };
  }

  toString() {
    return this.uuid;
  }

  get className() {
    return getClassName(this);
  }

  pageChange(page: number): void {
    this.tableProps.pagination.current = page;
    this.updateStorePageInfo();
  }

  pageSizeChange(current: number, size: number): void {
    this.tableProps.pagination.pageSize = size;
    this.tableProps.pagination.current = 1;
    this.updateStorePageInfo();
  }

  updateStorePageInfo() {
    this.domainService.syncPageInfo(toPageInfo(this.tableProps.pagination));
    //目前几种情况下，更新store.pageInfo后，当前页面的选择记录j 都应该清空
    this.changeSelectRows(undefined);
  }

  changeSelectRows(selectedRowKeys) {
    this.tableProps.rowSelection.selectedRowKeys = selectedRowKeys;
    this.setState({ selectedRowKeys });
  }

  /**
   * 不用lambda表达式是因为无法被子类继承重载
   */
  handleCreate() {
    this.setState({
      formProps: this.getFormProps('新增'),
    });
  }

  /**
   * 新增时的初始值
   */
  getInitItem(): Entity | undefined {
    return undefined;
  }

  handleUpdate() {
    const item = this.getSelectItem();
    if (item)
      this.setState({
        formProps: this.getFormProps('修改', item),
      });
  }

  handleDelete() {
    const { selectedRowKeys } = this.state;
    selectedRowKeys &&
      Promise.all(selectedRowKeys.map(id => this.domainService.delete(id))).then(this.handleDeleteResults.bind(this));
  }

  handleDeleteResults(results: DeleteResult[]) {
    const errorResults = results.filter(res => !res.success);
    if (errorResults.length > 0) message.error(errorResults.map(res => res.error));
    else message.success('删除成功');
    this.query();
  }

  /**
   * 不用get property是因为无法继承
   */
  getSelectItem() {
    const { selectedRowKeys, dataList } = this.state;
    if (!selectedRowKeys || !dataList) return null;
    const id = selectedRowKeys[0];
    return dataList.find(v => v.id === id);
  }

  getSelectItems() {
    const { selectedRowKeys, dataList } = this.state;
    if (!selectedRowKeys || !dataList) return [];
    return dataList.filter(v => selectedRowKeys.includes(v.id));
  }

  handleFormSuccess(item: Entity) {
    this.pageChange(1);
    this.setState({ formProps: undefined });
    this.query();
  }

  handleFormCancel() {
    this.setState({ formProps: undefined });
  }

  handleFormError(reason: any) {
    const notWork = (
      <div>
        <h2>保存失败：</h2>
        <blockquote>{reason}</blockquote>
      </div>
    );
    message.error(`保存失败：${reason}`);
  }

  getFormProps(action: string, item?: Entity): Partial<EntityFormProps> {
    return {
      title: `${action}${this.props.name}`,
      okText: action,
      domainService: this.domainService,
      onSuccess: this.handleFormSuccess.bind(this),
      onCancel: this.handleFormCancel.bind(this),
      onError: this.handleFormError,
      columns: this.columns,
      inputItem: item || this.getInitItem(),
    };
  }

  handleSearch(searchParam: any): void {
    this.domainService.store.searchParam = searchParam;
    this.tableProps.pagination.current = 1;
    this.updateStorePageInfo();
    this.query();
  }
  getEntityForm(): typeof EntityForm {
    return EntityForm;
  }
  getEntityFormPop(formProps?: Partial<EntityFormProps>) {
    if (formProps) {
      const FormComponent = EntityForm.formWrapper(this.getEntityForm());
      return <FormComponent {...formProps} />;
    } else return null;
  }
  getSearchForm(): React.ComponentType<SearchFormProps> | null {
    return null;
  }
  getOperatorEnable() {
    const { selectedRowKeys } = this.state;
    const selectedNum = selectedRowKeys ? selectedRowKeys.length : 0;
    return { update: selectedNum === 1, delete: selectedNum > 0 };
  }
}
