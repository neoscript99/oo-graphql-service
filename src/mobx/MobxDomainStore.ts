import { decorate, observable } from 'mobx';
import DomainStore, { Entity, PageInfo } from '../DomainStore';


/**
 * Mobx Store基类
 * 内部的属性会被JSON.stringify序列化，如果是嵌套结构或大对象，可以用Promise包装，规避序列化
 */
class MobxDomainStore implements DomainStore {
  constructor(public pageInfo: PageInfo = null,
              public currentItem: Entity = null,
              public allList: Entity[] = null,
              public pageList: Entity[] = null) {
    if (!pageInfo)
      this.pageInfo = { currentPage: 1, totalCount: -1, isLastPage: false, pageSize: 10 };
  }
}

decorate(MobxDomainStore, {
  currentItem: observable,
  allList: observable,
  pageList: observable,
  pageInfo: observable
})

export default MobxDomainStore;
