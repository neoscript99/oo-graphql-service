import { AfterLogin, LoginInfo, MenuService, ParamService, UserService } from '../../services/';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { EntityListProps } from '../layout';
import { DomainGraphql } from '../../DomainGraphql';
import { DeptService } from '../../services/DeptService';

export class AdminServices {
  userService: UserService;
  roleService: DomainService<MobxDomainStore>;
  paramService: ParamService;
  noteService: DomainService<MobxDomainStore>;
  menuService: MenuService;
  deptService: DeptService;

  constructor(domainGraphql: DomainGraphql, afterLogin: AfterLogin) {
    this.paramService = new ParamService(domainGraphql);
    this.noteService = new DomainService('note', MobxDomainStore, domainGraphql);
    this.roleService = new DomainService('role', MobxDomainStore, domainGraphql);
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
