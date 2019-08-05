import { MobxDomainStore } from '../mobx';
import { observable } from 'mobx';

export class UserStore extends MobxDomainStore {
  @observable
  lastRoutePath: string = '/'
}
