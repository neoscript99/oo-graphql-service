import { DomainService } from '../DomainService';
import { DomainGraphql } from '../DomainGraphql';
import { Entity } from '../DomainStore';
import { MobxDomainStore } from '../mobx';

export interface ParamEntity extends Entity {
  //后台定义的菜单对应功能代码
  code: string
  name: string
  value: string
  type: any
}

export class ParamService extends DomainService<MobxDomainStore> {

  constructor(domainGraphql: DomainGraphql) {
    super('param', MobxDomainStore, domainGraphql);
    this.listAll({})
  }

  getByCode(code: string): ParamEntity | undefined {
    const p = this.store.allList.find(param => param.code === code)
    return p && p as ParamEntity
  }
}
