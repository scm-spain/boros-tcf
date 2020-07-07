import {TcfApiV2} from '../../application/TcfApiV2'
import {inject} from '../../core/ioc/ioc'

class TcfApiController {
  constructor({tcfApi = inject(TcfApiV2)} = {}) {
    this._tcfApi = tcfApi
  }

  process(command, version, callback = () => null, parameter) {
    if (!this._isVersionCorrect(version) || !this._tcfApi[command]) {
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

  _isVersionCorrect(version) {
    if (!version) {
      return true
    }
    if (version !== 2) {
      return false
    }
    return true
  }
}

export {TcfApiController}
