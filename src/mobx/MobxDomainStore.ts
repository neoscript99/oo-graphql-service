import { decorate, observable } from 'mobx';
import { Entity, DomainStore, PageInfo, DEFAULT_PAGE_INFO } from '../DomainStore';


/**
 * Mobx Store基类
 * 内部的属性会被JSON.stringify序列化，如果是嵌套结构或大对象，可以用Promise包装，规避序列化
 */
export class MobxDomainStore implements DomainStore {
  constructor(public pageInfo: PageInfo = DEFAULT_PAGE_INFO,
              public currentItem: Entity = {},
              public allList: Entity[] = [],
              public pageList: Entity[] = [],
              public needRefresh: boolean = true,
              public searchParam: any = null) {
  }
}

decorate(MobxDomainStore, {
  currentItem: observable,
  allList: observable,
  pageList: observable,
  pageInfo: observable,
  needRefresh: observable,
  searchParam: observable
})
