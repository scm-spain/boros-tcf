/* eslint-disable standard/no-callback-literal */
/**
 * TCF Api Facade for the Version 2
 */
import {inject} from '../core/ioc/ioc'
import {PingUseCase} from './services/ping/PingUseCase'
import {GetVendorListUseCase} from './services/vendorlist/GetVendorListUseCase'
import {AddEventListenerUseCase} from './services/event/AddEventListenerUseCase'
import {RemoveEventListenerUseCase} from './services/event/RemoveEventListenerUseCase'

class TcfApiV2 {
  /**
   * @param {PingUseCase} pingUseCase
   * @param {GetVendorListUseCase} getVendorListUseCase
   */
  constructor({
    pingUseCase = inject(PingUseCase),
    getVendorListUseCase = inject(GetVendorListUseCase),
    addEventListenerUseCase = inject(AddEventListenerUseCase),
    removeEventListenerUseCase = inject(RemoveEventListenerUseCase)
  } = {}) {
    this._pingUseCase = pingUseCase
    this._getVendorListUseCase = getVendorListUseCase
    this._addEventListenerUseCase = addEventListenerUseCase
    this._removeEventListenerUseCase = removeEventListenerUseCase
  }

  getTCData(callback, vendorIds = []) {
    callback(null, false)
  }

  ping(callback) {
    callback(this._pingUseCase.execute(), true)
  }

  addEventListener(callback) {
    this._addEventListenerUseCase.execute({callback})
  }

  removeEventListener(callback, listenerId) {
    this._removeEventListenerUseCase.execute({callback, listenerId})
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
