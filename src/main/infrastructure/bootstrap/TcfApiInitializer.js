import {iocModule} from 'brusc'
import {IOC_MODULE} from '../../core/ioc/ioc'
import {PingUseCase} from '../../application/services/ping/PingUseCase'
import {GetVendorListUseCase} from '../../application/services/vendorlist/GetVendorListUseCase'
import {LoadUserConsentUseCase} from '../../application/services/vendorconsent/LoadUserConsentUseCase'
import {SaveUserConsentUseCase} from '../../application/services/vendorconsent/SaveUserConsentUseCase'
import {TcfApiRegistryService} from '../service/TcfApiRegistryService'
import {TcfApiController} from '../controller/TcfApiController'
import {BorosTcf} from '../../application/BorosTcf'
import {VendorListRepository} from '../../domain/vendorlist/VendorListRepository'
import {ConsentRepository} from '../../domain/consent/ConsentRepository'
import {CookieConsentRepository} from '../repository/CookieConsentRepository'
import {CookieStorage} from '../repository/cookie/CookieStorage'
import {BrowserCookieStorage} from '../repository/cookie/BrowserCookieStorage'
import {ConsentEncoderService} from '../../domain/consent/ConsentEncoderService'
import {IABConsentEncoderService} from '../service/IABConsentEncoderService'
import {ConsentDecoderService} from '../../domain/consent/ConsentDecoderService'
import {IABConsentDecoderService} from '../service/IABConsentDecoderService'
import {LoadConsentService} from '../../domain/consent/LoadConsentService'
import {ConsentFactory} from '../../domain/consent/ConsentFactory'
import {IABVendorListRepository} from '../repository/iab/IABVendorListRepository'
import {GVLFactory} from '../repository/iab/GVLFactory'
import {GetTCDataUseCase} from '../../application/services/tcdata/GetTCDataUseCase'
import {AddEventListenerUseCase} from '../../application/services/event/AddEventListenerUseCase'
import {DomainEventBus} from '../../domain/service/DomainEventBus'
import {ChangeUiVisibleUseCase} from '../../application/services/ui/ChangeUiVisibleUseCase'
import {RemoveEventListenerUseCase} from '../../application/services/event/RemoveEventListenerUseCase'
import {EventStatusService} from '../../domain/service/EventStatusService'
import {VendorListHelper} from '../../domain/vendorlist/VendorListHelper'
import {StatusRepository} from '../../domain/status/StatusRepository'
import {InMemoryStatusRepository} from '../../infrastructure/status/InMemoryStatusRepository'

import {TcfApiV2} from '../../application/TcfApiV2'
import {ObservableFactory} from '../../domain/service/ObservableFactory'

class TcfApiInitializer {
  static init({language, reporter} = {}) {
    if (typeof window !== 'undefined' && window.__tcfapi_boros) {
      return window.__tcfapi_boros
    }
    iocModule({
      module: IOC_MODULE,
      initializer: ({singleton}) => {
        // Application Facades
        singleton(TcfApiController, () => new TcfApiController())
        singleton(TcfApiV2, () => new TcfApiV2())

        // Use Cases
        singleton(AddEventListenerUseCase, () => new AddEventListenerUseCase())
        singleton(ChangeUiVisibleUseCase, () => new ChangeUiVisibleUseCase())
        singleton(GetTCDataUseCase, () => new GetTCDataUseCase())
        singleton(GetVendorListUseCase, () => new GetVendorListUseCase())
        singleton(LoadUserConsentUseCase, () => new LoadUserConsentUseCase())
        singleton(PingUseCase, () => new PingUseCase())
        singleton(
          RemoveEventListenerUseCase,
          () => new RemoveEventListenerUseCase()
        )
        singleton(SaveUserConsentUseCase, () => new SaveUserConsentUseCase())

        // Services
        singleton(ConsentDecoderService, () => new IABConsentDecoderService())
        singleton(ConsentEncoderService, () => new IABConsentEncoderService())
        singleton(DomainEventBus, () => new DomainEventBus({reporter}))
        singleton(EventStatusService, () => new EventStatusService())
        singleton(LoadConsentService, () => new LoadConsentService())

        // Repositories
        singleton(ConsentRepository, () => new CookieConsentRepository())
        singleton(StatusRepository, () => new InMemoryStatusRepository())
        singleton(VendorListRepository, () => new IABVendorListRepository())

        // Factories
        singleton(ConsentFactory, () => new ConsentFactory())
        singleton(GVLFactory, () => new GVLFactory({language}))
        singleton(ObservableFactory, () => new ObservableFactory())

        // Tooling & Helpers
        singleton(
          CookieStorage,
          () =>
            new BrowserCookieStorage({domain: window.location.hostname, window})
        )
        singleton(VendorListHelper, () => new VendorListHelper())
      }
    })

    const registryService = new TcfApiRegistryService()
    const borosTcf = new BorosTcf()

    registryService.register({borosTcf})
    borosTcf.ready()

    borosTcf.loadUserConsent({notify: true})
    if (typeof window !== 'undefined') {
      window.__tcfapi_boros = borosTcf
    }
    return borosTcf
  }
}

export {TcfApiInitializer}
