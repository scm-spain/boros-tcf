/**
 * TCF Api Facade for the Version 2
 */
import {inject} from '../core/ioc/ioc'
import {PingUseCase} from './ping/PingUseCase'

class TcfApiV2 {
  constructor({pingUseCase = inject(PingUseCase)} = {}) {
    this._pingUseCase = pingUseCase
  }

  getTCData(callback, vendorIds = []) {
    console.log('getTCData: NOT DEVELOPED YET')
    callback(null, false)
  }

  ping(callback) {
    callback(this._pingUseCase.execute(), true)
  }

  addEventListener(callback) {
    console.log('addEventListener: NOT DEVELOPED YET')
    callback(null, false)
  }

  removeEventListener(callback, listenerId) {
    console.log('removeEventListener: NOT DEVELOPED YET')
    callback(null, false)
  }

  getVendorList(callback, vendorListVersion = 'LATEST') {
    console.log('getVendorList: NOT DEVELOPED YET')
    callback(null, false)
  }
}

export {TcfApiV2}
