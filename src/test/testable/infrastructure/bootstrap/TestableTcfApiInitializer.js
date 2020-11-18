import {iocModule, iocReset} from 'brusc'
import {IOC_MODULE} from '../../../../main/core/ioc/ioc'
import {TcfApiInitializer} from '../../../../main/infrastructure/bootstrap/TcfApiInitializer'
import {GVLFactory} from '../../../../main/infrastructure/repository/iab/GVLFactory'
import {TestableGVLFactory} from '../repository/iab/TestableGVLFactory'

class TestableTcfApiInitializer {
  constructor() {
    this._mocks = new Map()
  }

  static create() {
    return new TestableTcfApiInitializer()
  }

  mock(key, instance) {
    this._mocks.set(key, instance)
    return this
  }

  init({language, reporter, latestGvlVersion, scope} = {}) {
    // default mocks
    this._keepOrAdd(
      GVLFactory,
      () => new TestableGVLFactory({language, latestGvlVersion})
    )

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
    return TcfApiInitializer.init({language, reporter, scope})
  }

  _keepOrAdd(mockKey, mockInitializer) {
    if (!this._mocks.has(mockKey)) {
      this._mocks.set(mockKey, mockInitializer())
    }
  }
}

export {TestableTcfApiInitializer}
