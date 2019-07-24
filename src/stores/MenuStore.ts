import { observable } from 'mobx';
import { MobxDomainStore } from '../mobx';
import { Entity } from '../DomainStore';

export interface MenuNode {
  menu: Entity;
  subMenus: MenuNode[]
}

export class MenuStore extends MobxDomainStore {
  @observable
  menuTree: MenuNode = { menu: {}, subMenus: [] };
}
