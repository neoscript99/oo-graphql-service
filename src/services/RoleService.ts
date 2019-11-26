import { DictInitService, DomainService } from '../DomainService';
import { DomainGraphql } from '../DomainGraphql';
import { Entity } from '../DomainStore';
import { MobxDomainStore } from '../mobx';

export interface RoleEntity extends Entity {
  roleName: string;
  roleCode: string;
  description: string;
  enabled: boolean;
  editable: boolean;
  lastUpdated: Date;
}

export class RoleService extends DomainService<MobxDomainStore> implements DictInitService {
  constructor(domainGraphql: DomainGraphql) {
    super('role', MobxDomainStore, domainGraphql);
  }

  initDictList() {
    this.listAll({ orders: [['lastUpdated', 'desc']] });
  }
}
