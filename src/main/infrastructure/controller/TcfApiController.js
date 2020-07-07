import {TcfApiV2} from '../../application/TcfApiV2'
import {inject} from '../../core/ioc/ioc'
import {TCF_API_VERSION} from '../../core/constants'

class TcfApiController {
  constructor({tcfApi = inject(TcfApiV2)} = {}) {
    this._tcfApi = tcfApi
  }

  process(
    command,
    version = TCF_API_VERSION,
    callback = () => null,
    parameter
  ) {
    if (version === 1 || !this._tcfApi[command]) {
      this._reject(callback)
    } else {
      try {
        return this._tcfApi[command](callback, parameter)
      } catch (error) {
        this._reject(callback)
      }
    }
  }

  get api() {
    return this._tcfApi
  }

  _reject(callback) {
    try {
      callback(null, false)
    } catch (ignored) {}
  }
}

export {TcfApiController}
