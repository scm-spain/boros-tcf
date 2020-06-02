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

class TcfApiInitializer {
  static init() {
    iocModule({
      module: IOC_MODULE,
      initializer: ({singleton}) => {
        singleton('window', () => window)

        singleton(TcfApiController, () => new TcfApiController())

        singleton(PingUseCase, () => new PingUseCase())
        singleton(GetVendorListUseCase, () => new GetVendorListUseCase())
        singleton(LoadUserConsentUseCase, () => new LoadUserConsentUseCase())
        singleton(SaveUserConsentUseCase, () => new SaveUserConsentUseCase())

        singleton(VendorListRepository, () => new IABVendorListRepository())
        singleton(GVLFactory, () => new GVLFactory())

        singleton(ConsentRepository, () => new CookieConsentRepository())
        singleton(CookieStorage, () => new BrowserCookieStorage())
        singleton(ConsentEncoderService, () => new IABConsentEncoderService())
        singleton(ConsentDecoderService, () => new IABConsentDecoderService())
        singleton(LoadConsentService, () => new LoadConsentService())
        singleton(ConsentFactory, () => new ConsentFactory())
      }
    })

    TcfApiRegistryService.start()
    return new BorosTcf()
  }
}

export {TcfApiInitializer}
