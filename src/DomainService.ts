import { processCriteriaOrder, processCriteriaPage } from './ooGrahpqlMobxUtils';
import upperFirst from 'lodash/upperFirst';
import DomainGraphql,{  ListResult, DeleteResult } from './DomainGraphql';
import DomainStore, { PageInfo } from './DomainStore';
import MessageStore, { MessageBody } from './MessageStore';


export declare type ListOptions = {
  criteria?: any
  pageInfo?: PageInfo
  orders?: Array<any>
  isAppend?: boolean
}

/**
 * Mobx Store基类
 * 内部的属性会被JSON.stringify序列化，如果是嵌套结构或大对象，可以用Promise包装，规避序列化
 */
export default class DomainService {
  private fieldsPromise: Promise<string>

  /**
   *
   * @param domain
   * @param graphqlClient
   * @param dependStoreMap 依赖的其它store，格式如下：{aaStore:aa,bbStore:bb}
   */
  constructor(private domain: string,
              private store: DomainStore,
              private messageStore: MessageStore,
              private graphql: DomainGraphql,
              private pageSize: number = 10) {
    this.fieldsPromise = graphql.getFields(upperFirst(domain))
    this.store.pageInfo = { currentPage: 1, totalCount: -1, isLastPage: false, pageSize };
  }


  findFirst(criteria: any = null) {
    const pageInfo = { pageSize: 1, currentPage: 1 }
    return this.list({ criteria, pageInfo })
      .then(data =>
        data && data.totalCount > 0 && this.changeCurrentItem(data.results[0]))
  }

  /**
   * 返回后设置 allList
   * @param criteria
   * @returns {Promise<{client: *, fields?: *}>}
   */

  listAll(criteria: any = null): Promise<void | ListResult> {
    return this.list({ criteria })
      .then(data => {
        if (data)
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

  list({ criteria = {}, pageInfo = null, orders = this.defaultOrders }: ListOptions): Promise<void | ListResult> {
    if (pageInfo)
      processCriteriaPage({ criteria, ...pageInfo })
    if (orders && orders.length > 0)
      processCriteriaOrder(criteria, orders)
    //list需等待fieldsPromise执行完成
    return this.fieldsPromise.then(fields => this.graphql.list(this.domain, fields, criteria))
      .catch(this.messageStore.newGraphqlError)
  }

  /**
   * 如需默认排序，重载本方法
   * @returns {null}
   */
  get defaultOrders() {
    return null;
  }

  /**
   * 返回后设置 pageInfo pageList allList
   * @param isAppend
   * @param rest
   * @returns {Promise<{client: *, fields?: *}>}
   */

  listPage({ isAppend = false, ...rest }): Promise<void | ListResult> {
    //查询第一页的时候，清空allList
    if (this.store.pageInfo.currentPage === 1)
      this.store.allList = [];
    return this.list({ pageInfo: this.store.pageInfo, ...rest })
      .then(data => {
        if (data) {
          const { results, totalCount } = data;
          this.store.pageList = results;
          this.store.pageInfo.totalCount = totalCount;
          this.store.pageInfo.isLastPage = (results.length < this.store.pageInfo.pageSize ||
            this.store.pageInfo.pageSize * this.store.pageInfo.currentPage >= totalCount)
          if (isAppend === true)
            this.store.allList = this.store.allList.concat(results)
          else
            this.store.allList = results;
        }
        return data;
      })
  }


  listNextPage(param): Promise<void | ListResult> {
    if (this.store.pageInfo.isLastPage)
      this.messageStore.newMessage(new MessageBody('已经到底了'))
    else {
      this.store.pageInfo.currentPage++;
      return this.listPage(param);
    }
  }


  listFirstPage(param): Promise<void | ListResult> {
    this.store.pageInfo.currentPage = 1;
    return this.listPage(param);
  }


  clearList() {
    this.store.pageList = [];
    this.store.allList = [];
  }


  changeCurrentItem(currentItem): any {
    this.store.currentItem = currentItem;
    return currentItem;
  }


  create(newItem): Promise<any> {
    return this.fieldsPromise.then(fields => this.graphql.create(this.domain, fields, newItem))
      .then(data => {
        this.messageStore.newSuccess('保存成功');
        return this.changeCurrentItem(data);
      })
      .catch(this.messageStore.newGraphqlError)
  }


  update(id, updateItem): Promise<any> {
    return this.fieldsPromise.then(fields => this.graphql.update(this.domain, fields, id, updateItem))
      .then(data => {
        this.messageStore.newSuccess('更新成功');
        return this.changeCurrentItem(data);
      })
      .catch(this.messageStore.newGraphqlError)
  }


  get(id): Promise<any> {
    return this.fieldsPromise.then(fields => this.graphql.get(this.domain, fields, id))
      .then(data => this.changeCurrentItem(data))
      .catch(this.messageStore.newGraphqlError)
  }


  delete(id): Promise<void | DeleteResult> {
    return this.graphql.delete(this.domain, id)
      .catch(this.messageStore.newGraphqlError)
  }
}

