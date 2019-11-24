import { DictInitService, DomainService } from '../DomainService';
import { DomainGraphql } from '../DomainGraphql';
import { Entity } from '../DomainStore';
import { MobxDomainStore } from '../mobx';

export interface DeptEntity extends Entity {
  name: string;
  seq: string;
  enabled: boolean;
}

export class DeptService extends DomainService<MobxDomainStore> implements DictInitService {
  constructor(domainGraphql: DomainGraphql) {
    super('department', MobxDomainStore, domainGraphql);
  }

  initDictList() {
    this.listAll({ criteria: { eq: [['enabled', true]] }, orders: ['seq'] });
  }
}
