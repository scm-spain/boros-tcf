/**
 * TCF Api Facade for the Version 2
 */
import {inject} from '../core/ioc/ioc'
import {PingUseCase} from './services/ping/PingUseCase'
import {GetVendorListUseCase} from './services/vendorlist/GetVendorListUseCase'

class TcfApiV2 {
  /**
   * @param {PingUseCase} pingUseCase
   * @param {GetVendorListUseCase} getVendorListUseCase
   */
  constructor({
    pingUseCase = inject(PingUseCase),
    getVendorListUseCase = inject(GetVendorListUseCase)
  } = {}) {
    this._pingUseCase = pingUseCase
    this._getVendorListUseCase = getVendorListUseCase
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

  getVendorList(callback, vendorListVersion) {
    return this._getVendorListUseCase
      .execute({vendorListVersion})
      .then(vendorList => callback(vendorList, true))
      .catch(error => {
        console.log('Error obtaining the vendor list', error)
        callback(null, false)
      })
  }
}

export {TcfApiV2}
