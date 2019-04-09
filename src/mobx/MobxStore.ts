import { decorate, observable } from 'mobx';
import DomainStore, { PageInfo } from '../DomainStore';


/**
 * Mobx Store基类
 * 内部的属性会被JSON.stringify序列化，如果是嵌套结构或大对象，可以用Promise包装，规避序列化
 */
class MobxStore implements DomainStore {
  constructor(public pageInfo: PageInfo = null,
              public currentItem = { id: '' },
              public allList = [],
              public pageList = []) {
  }
}

decorate(MobxStore, {
  currentItem: observable,
  allList: observable,
  pageList: observable,
  pageInfo: observable
})

export default MobxStore;
