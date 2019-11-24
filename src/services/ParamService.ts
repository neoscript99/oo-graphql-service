import { DictInitService, DomainService } from '../DomainService';
import { DomainGraphql } from '../DomainGraphql';
import { Entity } from '../DomainStore';
import { MobxDomainStore } from '../mobx';

export interface ParamEntity extends Entity {
  //后台定义的菜单对应功能代码
  code: string;
  name: string;
  value: string;
  type: any;
}

export class ParamService extends DomainService<MobxDomainStore> implements DictInitService {
  constructor(domainGraphql: DomainGraphql) {
    super('param', MobxDomainStore, domainGraphql);
  }

  /**
   * 登陆成功后调用本方法
   */
  initDictList() {
    this.listAll({});
  }

  getByCode(code: string): ParamEntity | undefined {
    const p = this.store.allList.find(param => param.code === code);
    return p && (p as ParamEntity);
  }
}
