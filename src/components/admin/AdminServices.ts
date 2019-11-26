import { AfterLogin, DeptService, MenuService, ParamService, RoleService, UserService } from '../../services/';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { EntityListProps } from '../layout';
import { DomainGraphql } from '../../DomainGraphql';

export class AdminServices {
  userService: UserService;
  roleService: RoleService;
  paramService: ParamService;
  noteService: DomainService<MobxDomainStore>;
  menuService: MenuService;
  deptService: DeptService;
  userRoleService: DomainService<MobxDomainStore>;

  constructor(domainGraphql: DomainGraphql, afterLogin: AfterLogin) {
    this.paramService = new ParamService(domainGraphql);
    this.noteService = new DomainService('note', MobxDomainStore, domainGraphql);
    this.userRoleService = new DomainService('userRole', MobxDomainStore, domainGraphql);
    this.roleService = new RoleService(domainGraphql);
    this.menuService = new MenuService(domainGraphql);
    this.userService = new UserService([this.afterLogin.bind(this), afterLogin], domainGraphql);
    this.deptService = new DeptService(domainGraphql);
  }

  afterLogin() {
    this.paramService.initDictList();
    this.deptService.initDictList();
    this.menuService.getMenuTree();
  }
}

export interface AdminPageProps extends EntityListProps {
  services: AdminServices;
}
