import upperFirst from 'lodash/upperFirst';
import {
  ListResult,
  DeleteResult,
  Criteria,
  DomainGraphql,
  CriteriaOrder,
  DomainStore,
  Entity,
  PageInfo,
  processCriteriaOrder,
  processCriteriaPage,
} from './';
import { AbstractFetch } from './utils/fetch/AbstractFetch';

/**
 * ListOptions.orders会做嵌套处理，但目前嵌套属性排序不成功，可能是DetachedCriteria的原因，原先在Flex中是成功的
 * ListOptions.criteria.order不做处理，传入原始值
 */
export interface ListOptions {
  criteria?: Criteria;
  //如果传入，覆盖store的pageInfo
  pageInfo?: PageInfo;
  orders?: CriteriaOrder[];
  isAppend?: boolean;
}

export interface DictInitService {
  initDictList();
}
/**
 * Mobx Store基类
 * 内部的属性会被JSON.stringify序列化，如果是嵌套结构或大对象，可以用Promise包装，规避序列化
 */
export class DomainService<D extends DomainStore> {
  public store: D;
  public fieldsPromise: Promise<string>;

  /**
   *
   * @param domain
   * @param graphqlClient
   * @param dependStoreMap 依赖的其它store，格式如下：{aaStore:aa,bbStore:bb}
   */
  constructor(
    public domain: string,
    public storeClass: new () => D,
    public domainGraphql: DomainGraphql,
    public fetchClient?: AbstractFetch,
  ) {
    this.store = new storeClass();
    this.fieldsPromise = domainGraphql.getFields(upperFirst(domain));
  }

  findFirst(criteria?: Criteria) {
    const pageInfo = { pageSize: 1, currentPage: 1 };
    return this.list({ criteria, pageInfo }).then(
      data => data.totalCount > 0 && this.changeCurrentItem(data.results[0]),
    );
  }

  /**
   * 返回后设置 allList
   * @param criteria
   * @returns {Promise<{client: *, fields?: *}>}
   */

  listAll(options: ListOptions): Promise<ListResult> {
    return this.list(options).then(data => {
      this.store.allList = data.results;
      return data;
    });
  }

  /**
   * 不改变类成员变量
   * @param criteria
   * @param pageInfo
   * @param orders
   * @returns {Promise<{client: *, fields?: *}>}
   */

  list({ criteria = {}, pageInfo, orders = this.defaultOrders }: ListOptions): Promise<ListResult> {
    if (pageInfo) processCriteriaPage(criteria, pageInfo);
    if (orders && orders.length > 0) processCriteriaOrder(criteria, orders);
    //list需等待fieldsPromise执行完成
    return this.fieldsPromise.then(
      fields => this.domainGraphql.list(this.domain, fields, criteria) as Promise<ListResult>,
    );
  }

  /**
   * 如需默认排序，重载本方法
   * @returns {null}
   */
  get defaultOrders(): CriteriaOrder[] {
    return [];
  }

  /**
   * 返回后设置 pageInfo pageList allList
   *
   *
   * @param {boolean} isAppend
   * @param {PageInfo} pageInfo 此处传入pageInfo优先，以store.pageInfo为准
   * @param {{criteria?: Criteria; orders?: CriteriaOrder[]}} rest
   * @returns {Promise<ListResult>}
   */
  listPage({ isAppend = false, pageInfo, ...rest }: ListOptions): Promise<ListResult> {
    //查询第一页的时候，清空allList
    if (pageInfo) this.store.pageInfo = pageInfo;
    if (this.store.pageInfo.currentPage === 1) this.store.allList = [];
    return this.list({ pageInfo: this.store.pageInfo, ...rest }).then(data => {
      const { results, totalCount } = data;
      this.store.pageList = results;
      this.store.pageInfo.totalCount = totalCount;
      this.store.pageInfo.isLastPage =
        results.length < this.store.pageInfo.pageSize ||
        this.store.pageInfo.pageSize * this.store.pageInfo.currentPage >= totalCount;
      if (isAppend === true) this.store.allList = this.store.allList.concat(results);
      else this.store.allList = results;
      return data;
    });
  }

  listNextPage(param: ListOptions): string | Promise<ListResult> {
    if (this.store.pageInfo.isLastPage) return '已经到底了';
    else {
      this.store.pageInfo.currentPage++;
      return this.listPage(param);
    }
  }

  listFirstPage(param: ListOptions): Promise<ListResult> {
    this.store.pageInfo.currentPage = 1;
    return this.listPage(param);
  }

  clearList() {
    this.store.pageList = [];
    this.store.allList = [];
  }

  changeCurrentItem(currentItem: Entity): Entity {
    this.store.currentItem = currentItem;
    return currentItem;
  }

  create(newItem: Entity): Promise<Entity> {
    return this.fieldsPromise
      .then(fields => this.domainGraphql.create(this.domain, fields, newItem))
      .then(data => this.changeCurrentItem(data as Entity));
  }

  update(id: any, updateItem: Entity): Promise<Entity> {
    return this.fieldsPromise
      .then(fields => this.domainGraphql.update(this.domain, fields, id, updateItem))
      .then(data => this.changeCurrentItem(data as Entity));
  }

  /**
   * create or update
   * @param newItem
   */
  save(newItem: Entity): Promise<Entity> {
    return newItem.id ? this.update(newItem.id, newItem) : this.create(newItem);
  }

  get(id: any): Promise<Entity> {
    return this.fieldsPromise
      .then(fields => this.domainGraphql.get(this.domain, fields, id))
      .then(data => this.changeCurrentItem(data as Entity));
  }

  delete(id: any): Promise<DeleteResult> {
    return this.domainGraphql.delete(this.domain, id);
  }

  syncPageInfo(newPageInfo: PageInfo) {
    Object.assign(this.store.pageInfo, newPageInfo);
  }
}
