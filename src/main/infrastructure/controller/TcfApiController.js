import {TcfApiV2} from '../../application/TcfApiV2'

class TcfApiController {
  constructor() {
    this._tcfApi = undefined
  }

  process(command, version, callback, parameter) {
    // TODO just a prototype
    if (version !== 2) {
      console.log('TcfApiController: unaccepted version')
      return
    }
    if (typeof callback !== 'function') {
      console.log('TcfApiController: callback must be a function')
      return
    }
    // initialize the TcfApiV2 if not initialized yet,
    // this initializes all the dependencies only when called at the first time
    this._tcfApi = this._tcfApi || new TcfApiV2()
    if (!this._tcfApi[command]) {
      callback(null, false)
    }
    try {
      this._tcfApi[command](callback, parameter)
    } catch (error) {
      console.log(`TcfApiController: error processing [${command}]`, error)
      callback(null, false)
    }
  }
}

export {TcfApiController}
