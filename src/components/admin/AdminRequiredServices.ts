import { MenuService, UserService } from '../../services/';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { EntityListProps } from '../layout';

export interface AdminRequiredServices {
  noteService: DomainService<MobxDomainStore>
  userService: UserService
  paramService: DomainService<MobxDomainStore>
  roleService: DomainService<MobxDomainStore>
  menuService: MenuService
}

export interface AdminPageProps extends EntityListProps {
  services: AdminRequiredServices
}
