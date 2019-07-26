import { observable } from 'mobx';
import { MobxDomainStore } from '../mobx';
import { Entity } from '../DomainStore';

export interface MenuEntity extends Entity {
  //后台定义的菜单对应功能代码
  app?: string
  label: string
  seq: number
}

export interface MenuNode {
  menu: MenuEntity;
  subMenus: MenuNode[]
}

export class MenuStore extends MobxDomainStore {
  @observable
  menuTree: MenuNode = { menu: { label: 'none', seq: 0 }, subMenus: [] };
}
