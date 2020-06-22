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
import {CmpStatusRepository} from '../../domain/status/CmpStatusRepository'
import {InMemoryCmpStatusRepository} from '../../application/services/status/InMemoryCmpStatusRepository'
import {DisplayStatusRepository} from '../../domain/status/DisplayStatusRepository'
import {InMemoryDisplayStatusRepository} from '../../application/services/status/InMemoryDisplayStatusRepository'
import {GetTCDataUseCase} from '../../application/services/tcdata/GetTCDataUseCase'
import {AddEventListenerUseCase} from '../../application/services/event/AddEventListenerUseCase'
import {DomainEventBus} from '../../domain/service/DomainEventBus'
import {ChangeUiVisibleUseCase} from '../../application/services/ui/ChangeUiVisibleUseCase'
import {RemoveEventListenerUseCase} from '../../application/services/event/RemoveEventListenerUseCase'
import {ObservableEventStatus} from '../../domain/service/ObservableEventStatus'
import {EventStatusService} from '../../domain/service/EventStatusService'

class TcfApiInitializer {
  static init() {
    iocModule({
      module: IOC_MODULE,
      initializer: ({singleton}) => {
        singleton('window', () => window)

        singleton(TcfApiController, () => new TcfApiController())

        singleton(CmpStatusRepository, () => new InMemoryCmpStatusRepository())
        singleton(
          DisplayStatusRepository,
          () => new InMemoryDisplayStatusRepository()
        )
        singleton(PingUseCase, () => new PingUseCase())
        singleton(GetVendorListUseCase, () => new GetVendorListUseCase())
        singleton(LoadUserConsentUseCase, () => new LoadUserConsentUseCase())
        singleton(SaveUserConsentUseCase, () => new SaveUserConsentUseCase())
        singleton(GetTCDataUseCase, () => new GetTCDataUseCase())

        singleton(
          RemoveEventListenerUseCase,
          () => new RemoveEventListenerUseCase()
        )

        singleton(VendorListRepository, () => new IABVendorListRepository())
        singleton(GVLFactory, () => new GVLFactory())

        singleton(ConsentRepository, () => new CookieConsentRepository())
        singleton(CookieStorage, () => new BrowserCookieStorage())
        singleton(ConsentEncoderService, () => new IABConsentEncoderService())
        singleton(ConsentDecoderService, () => new IABConsentDecoderService())
        singleton(
          DomainEventBus,
          () =>
            new DomainEventBus({
              observableFactory: observer =>
                new ObservableEventStatus({observer})
            })
        )
        singleton(EventStatusService, () => new EventStatusService())
        singleton(AddEventListenerUseCase, () => new AddEventListenerUseCase())
        singleton(ChangeUiVisibleUseCase, () => new ChangeUiVisibleUseCase())
        singleton(LoadConsentService, () => new LoadConsentService())
        singleton(ConsentFactory, () => new ConsentFactory())
      }
    })

    TcfApiRegistryService.start()
    return new BorosTcf()
  }
}

export {TcfApiInitializer}
