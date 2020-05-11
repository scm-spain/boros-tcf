import {iocModule, iocReset} from 'brusc'
import {IOC_MODULE} from '../../../../main/core/ioc/ioc'
import {TcfApiInitializer} from '../../../../main/infrastructure/bootstrap/TcfApiInitializer'

class TestableInitializer {
  constructor() {
    this._mocks = new Map()
  }

  static create() {
    return new TestableInitializer()
  }

  mock(key, instance) {
    this._mocks.set(key, instance)
    return this
  }

  init() {
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
    return TcfApiInitializer.init()
  }
}

export {TestableInitializer}
