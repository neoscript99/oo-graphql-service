import { PortletDataSourceService } from '../../services/';
import { DomainService, MobxDomainStore } from '../../';

export interface PortalRequriedServices {
  portletColRelService: DomainService<MobxDomainStore>
  portletDataSourceService: PortletDataSourceService
  portalRowRelService: DomainService<MobxDomainStore>
  portletTabRelService: DomainService<MobxDomainStore>
  portletCalendarService: DomainService<MobxDomainStore>
  portletLinkService: DomainService<MobxDomainStore>

  [key: string]: DomainService<MobxDomainStore>
}
