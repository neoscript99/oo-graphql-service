import {
  AfterLogin,
  DeptService,
  MenuService,
  ParamService,
  RoleService,
  UserService,
  UserRoleService,
} from '../../services/';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { EntityListProps } from '../layout';
import { DomainGraphql } from '../../DomainGraphql';
import { AbstractFetch } from '../../utils/fetch/AbstractFetch';

export class AdminServices {
  userService: UserService;
  roleService: RoleService;
  paramService: ParamService;
  noteService: DomainService<MobxDomainStore>;
  menuService: MenuService;
  deptService: DeptService;
  userRoleService: UserRoleService;

  constructor(domainGraphql: DomainGraphql, afterLogin: AfterLogin, fetchClient: AbstractFetch) {
    this.paramService = new ParamService(domainGraphql);
    this.noteService = new DomainService('note', MobxDomainStore, domainGraphql);
    this.userRoleService = new UserRoleService(domainGraphql, fetchClient);
    this.roleService = new RoleService(domainGraphql);
    this.menuService = new MenuService(domainGraphql);
    this.userService = new UserService([this.afterLogin.bind(this), afterLogin], domainGraphql);
    this.deptService = new DeptService(domainGraphql);
  }

  afterLogin() {
    this.paramService.initDictList();
    this.deptService.initDictList();
    this.roleService.initDictList();
    this.menuService.getMenuTree();
  }
}

export interface AdminPageProps extends EntityListProps {
  services: AdminServices;
}
