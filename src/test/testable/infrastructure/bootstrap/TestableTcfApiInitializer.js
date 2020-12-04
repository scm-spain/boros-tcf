import {inject} from '../../../../main/core/ioc/ioc'
import {TcfApiInitializer} from '../../../../main/infrastructure/bootstrap/TcfApiInitializer'
import {GVLFactory} from '../../../../main/infrastructure/repository/iab/GVLFactory'
import {TestableGVLFactory} from '../repository/iab/TestableGVLFactory'

class TestableTcfApiInitializer {
  constructor() {
    this._mocks = {}
  }

  static create() {
    return new TestableTcfApiInitializer()
  }

  mock(key, instance) {
    this._mocks[key] = () => instance
    return this
  }

  init({language, reporter, latestGvlVersion, scope} = {}) {
    // default mocks
    this._keepOrAdd(
      GVLFactory,
      () => new TestableGVLFactory({language, latestGvlVersion})
    )

    inject.defaults = {
      ...this._mocks
    }
    return TcfApiInitializer.init({language, reporter, scope})
  }

  _keepOrAdd(mockKey, mockInitializer) {
    if (!this._mocks[mockKey]) {
      this._mocks[mockKey] = mockInitializer
    }
  }
}

export {TestableTcfApiInitializer}
