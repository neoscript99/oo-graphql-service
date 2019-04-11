import { processCriteriaOrder, processCriteriaPage } from './ooGrahpqlMobxUtils';
import upperFirst from 'lodash/upperFirst';
import DomainGraphql, { ListResult, DeleteResult, Criteria, CriteriaOrder } from './DomainGraphql';
import DomainStore, { Entity, PageInfo } from './DomainStore';


export declare type ListOptions = {
  criteria?: Criteria
  pageInfo?: PageInfo//特殊情况下，可以覆盖store的pageInfo
  orders?: CriteriaOrder[]
  isAppend?: boolean
}

/**
 * Mobx Store基类
 * 内部的属性会被JSON.stringify序列化，如果是嵌套结构或大对象，可以用Promise包装，规避序列化
 */
export default class DomainService<D extends DomainStore<E>, E extends Entity=Entity> {
  public store: D
  private fieldsPromise: Promise<string>

  /**
   *
   * @param domain
   * @param graphqlClient
   * @param dependStoreMap 依赖的其它store，格式如下：{aaStore:aa,bbStore:bb}
   */
  constructor(public domain: string,
              public storeClass: (new () => D),
              public domainGraphql: DomainGraphql) {
    this.store = new storeClass()
    this.fieldsPromise = domainGraphql.getFields(upperFirst(domain))
  }


  findFirst(criteria: Criteria = null) {
    const pageInfo = { pageSize: 1, currentPage: 1 }
    return this.list({ criteria, pageInfo })
      .then(data => data.totalCount > 0 && this.changeCurrentItem(data.results[0]))
  }

  /**
   * 返回后设置 allList
   * @param criteria
   * @returns {Promise<{client: *, fields?: *}>}
   */

  listAll(criteria: Criteria = null): Promise<ListResult<E>> {
    return this.list({ criteria })
      .then(data => {
        this.store.allList = data.results
        return data
      })
  }

  /**
   * 不改变类成员变量
   * @param criteria
   * @param pageInfo
   * @param orders
   * @returns {Promise<{client: *, fields?: *}>}
   */

  list({ criteria = null, pageInfo = null, orders = this.defaultOrders }: ListOptions): Promise<ListResult<E>> {
    if (pageInfo)
      processCriteriaPage(criteria, pageInfo)
    if (orders && orders.length > 0)
      processCriteriaOrder(criteria, orders)
    //list需等待fieldsPromise执行完成
    return this.fieldsPromise.then(fields => <Promise<ListResult<E>>>this.domainGraphql.list(this.domain, fields, criteria))
  }

  /**
   * 如需默认排序，重载本方法
   * @returns {null}
   */
  get defaultOrders(): CriteriaOrder[] | null {
    return null;
  }

  /**
   * 返回后设置 pageInfo pageList allList
   *
   *
   * @param {boolean} isAppend
   * @param {PageInfo} pageInfo 此处传入pageInfo无效，以store.pageInfo为准
   * @param {{criteria?: Criteria; orders?: CriteriaOrder[]}} rest
   * @returns {Promise<ListResult>}
   */
  listPage({ isAppend = false, pageInfo, ...rest }: ListOptions): Promise<ListResult<E>> {
    //查询第一页的时候，清空allList
    if (this.store.pageInfo.currentPage === 1)
      this.store.allList = [];
    return this.list({ pageInfo: this.store.pageInfo, ...rest })
      .then(data => {
        const { results, totalCount } = data;
        this.store.pageList = results;
        this.store.pageInfo.totalCount = totalCount;
        this.store.pageInfo.isLastPage = (results.length < this.store.pageInfo.pageSize ||
          this.store.pageInfo.pageSize * this.store.pageInfo.currentPage >= totalCount)
        if (isAppend === true)
          this.store.allList = this.store.allList.concat(results)
        else
          this.store.allList = results;
        return data;
      })
  }


  listNextPage(param: ListOptions): string | Promise<ListResult<E>> {
    if (this.store.pageInfo.isLastPage)
      return '已经到底了'
    else {
      this.store.pageInfo.currentPage++;
      return this.listPage(param);
    }
  }


  listFirstPage(param: ListOptions): Promise<ListResult<E>> {
    this.store.pageInfo.currentPage = 1;
    return this.listPage(param);
  }


  clearList() {
    this.store.pageList = [];
    this.store.allList = [];
  }


  changeCurrentItem(currentItem: E): E {
    this.store.currentItem = currentItem;
    return currentItem;
  }


  create(newItem: E): Promise<E> {
    return this.fieldsPromise.then(fields => this.domainGraphql.create(this.domain, fields, newItem))
      .then(data => this.changeCurrentItem(<E>data))
  }


  update(id: any, updateItem: E): Promise<E> {
    return this.fieldsPromise.then(fields => this.domainGraphql.update(this.domain, fields, id, updateItem))
      .then(data => this.changeCurrentItem(<E>data))
  }


  get(id: any): Promise<E> {
    return this.fieldsPromise.then(fields => this.domainGraphql.get(this.domain, fields, id))
      .then(data => this.changeCurrentItem(<E>data))
  }


  delete(id: any): Promise<DeleteResult> {
    return this.domainGraphql.delete(this.domain, id)
  }
}

