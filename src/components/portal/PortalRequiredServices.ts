import { PortletDataSourceService } from '../../services/';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';

export interface PortalRequiredServices {
  portletColRelService: DomainService<MobxDomainStore>
  portletDataSourceService: PortletDataSourceService
  portalRowRelService: DomainService<MobxDomainStore>
  portletTabRelService: DomainService<MobxDomainStore>
  portletCalendarService: DomainService<MobxDomainStore>
  portletLinkService: DomainService<MobxDomainStore>
  portletListViewService: DomainService<MobxDomainStore>
  portletTableService: DomainService<MobxDomainStore>
}
