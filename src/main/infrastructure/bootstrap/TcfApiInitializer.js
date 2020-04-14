import {iocModule} from 'brusc'
import {IOC_MODULE} from '../../core/ioc/ioc'
import {PingUseCase} from '../../application/ping/PingUseCase'
import {TcfApiRegistryService} from '../service/TcfApiRegistryService'
import {TcfApiController} from '../controller/TcfApiController'

class TcfApiInitializer {
  static init({window}) {
    iocModule({
      module: IOC_MODULE,
      initializer: ({singleton}) => {
        singleton('window', () => window)

        singleton(TcfApiController, () => new TcfApiController())
        singleton(PingUseCase, () => new PingUseCase())
      }
    })
    return TcfApiRegistryService.start()
  }
}

export {TcfApiInitializer}
