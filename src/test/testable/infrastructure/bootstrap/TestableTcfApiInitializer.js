import {iocModule, iocReset} from 'brusc'
import {IOC_MODULE} from '../../../../main/core/ioc/ioc'
import {TcfApiInitializer} from '../../../../main/infrastructure/bootstrap/TcfApiInitializer'
import {GVLFactory} from '../../../../main/infrastructure/repository/iab/GVLFactory'
import {TestableGVLFactory} from '../repository/iab/TestableGVLFactory'

class TestableTcfApiInitializer {
  constructor() {
    this._mocks = new Map()
    // default mocks
    this._mocks.set(GVLFactory, new TestableGVLFactory())
  }

  static create() {
    return new TestableTcfApiInitializer()
  }

  mock(key, instance) {
    this._mocks.set(key, instance)
    return this
  }

  init({language, reporter} = {}) {
    iocReset(IOC_MODULE)
    iocModule({
      module: IOC_MODULE,
      initializer: ({singleton}) => {
        Array.from(this._mocks.entries()).forEach(([key, instance]) =>
          singleton(key, () => instance)
        )
      },
      chain: true
    })
    return TcfApiInitializer.init({language, reporter})
  }
}

export {TestableTcfApiInitializer}
