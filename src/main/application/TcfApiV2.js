/**
 * TCF Api Facade for the Version 2
 */
import {inject} from '../core/ioc/ioc'
import {PingUseCase} from './services/ping/PingUseCase'
import {GetVendorListUseCase} from './services/vendorlist/GetVendorListUseCase'
import { GetTCDataUseCase } from './services/tcdata/GetTCDataUseCase'

class TcfApiV2 {
  /**
   * @param {Object} param
   * @param {PingUseCase} param.pingUseCase
   * @param {GetVendorListUseCase} param.getVendorListUseCase
   * @param {GetTCDataUseCase} param.getTCDataUseCase
   */
  constructor({
    pingUseCase = inject(PingUseCase),
    getVendorListUseCase = inject(GetVendorListUseCase),
    getTCDataUseCase = inject(GetTCDataUseCase)
  } = {}) {
    this._pingUseCase = pingUseCase
    this._getVendorListUseCase = getVendorListUseCase
    this._getTCDataUseCase = getTCDataUseCase
  }

  getTCData(callback, vendorIds = []) {
    callback(this._getTCDataUseCase.execute({vendorIds}), true)
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
