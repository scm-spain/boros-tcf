import {iocModule} from 'brusc'
import {IOC_MODULE} from '../../core/ioc/ioc'
import {PingUseCase} from '../../application/services/ping/PingUseCase'
import {GetVendorListUseCase} from '../../application/services/vendorlist/GetVendorListUseCase'
import {GetConsentStatusUseCase} from '../../application/services/vendor_consent/GetConsentStatusUseCase'
import {LoadUserConsentUseCase} from '../../application/services/vendor_consent/LoadUserConsentUseCase'
import {SaveUserConsentUseCase} from '../../application/services/vendor_consent/SaveUserConsentUseCase'
import {TcfApiRegistryService} from '../service/TcfApiRegistryService'
import {TcfApiController} from '../controller/TcfApiController'
import {BorosTcf} from '../../application/BorosTcf'
import {HttpClient} from '../repository/http/HttpClient'
import {AxiosHttpClient} from '../repository/http/AxiosHttpClient'
import {VendorListRepository} from '../../domain/vendorlist/VendorListRepository'
import {HttpVendorListRepository} from '../repository/HttpVendorListRepository'

class TcfApiInitializer {
  static init() {
    iocModule({
      module: IOC_MODULE,
      initializer: ({singleton}) => {
        singleton('window', () => window)

        singleton(TcfApiController, () => new TcfApiController())

        singleton(PingUseCase, () => new PingUseCase())
        singleton(GetVendorListUseCase, () => new GetVendorListUseCase())
        singleton(GetConsentStatusUseCase, () => new GetConsentStatusUseCase())
        singleton(LoadUserConsentUseCase, () => new LoadUserConsentUseCase())
        singleton(SaveUserConsentUseCase, () => new SaveUserConsentUseCase())

        singleton(VendorListRepository, () => new HttpVendorListRepository())
        singleton(HttpClient, () => new AxiosHttpClient())
      }
    })

    TcfApiRegistryService.start()
    return new BorosTcf()
  }
}

export {TcfApiInitializer}
