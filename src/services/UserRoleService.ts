import { DomainService } from '../DomainService';
import { DomainGraphql } from '../DomainGraphql';
import { MobxDomainStore } from '../mobx';
import { Entity } from '../DomainStore';
import { AbstractFetch } from '../utils/fetch/AbstractFetch';

export class UserRoleService extends DomainService<MobxDomainStore> {
  fetchClient: AbstractFetch;
  constructor(domainGraphql: DomainGraphql, fetchClient: AbstractFetch) {
    super('userRole', MobxDomainStore, domainGraphql, fetchClient);
    this.fetchClient = fetchClient;
  }

  saveUserRoles(user: Entity, roleIds: string[]) {
    return this.fetchClient.post('/api/users/withRoles', { user, roleIds });
  }
}
