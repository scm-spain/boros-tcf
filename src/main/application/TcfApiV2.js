/* eslint-disable standard/no-callback-literal */
/**
 * TCF Api Facade for the Version 2
 */
import {inject} from '../core/ioc/ioc'
import {PingUseCase} from './services/ping/PingUseCase'
import {GetVendorListUseCase} from './services/vendorlist/GetVendorListUseCase'
import {GetTCDataUseCase} from './services/tcdata/GetTCDataUseCase'
import {AddEventListenerUseCase} from './services/event/AddEventListenerUseCase'
import {RemoveEventListenerUseCase} from './services/event/RemoveEventListenerUseCase'

class TcfApiV2 {
  /**
   * @param {Object} param
   * @param {PingUseCase} param.pingUseCase
   * @param {GetVendorListUseCase} param.getVendorListUseCase
   * @param {AddEventListenerUseCase} param.addEventListenerUseCase
   * @param {RemoveEventListenerUseCase} param.removeEventListener
   * @param {GetTCDataUseCase} param.getTCDataUseCase
   */
  constructor({
    pingUseCase = inject(PingUseCase),
    getVendorListUseCase = inject(GetVendorListUseCase),
    addEventListenerUseCase = inject(AddEventListenerUseCase),
    removeEventListenerUseCase = inject(RemoveEventListenerUseCase),
    getTCDataUseCase = inject(GetTCDataUseCase)
  } = {}) {
    this._pingUseCase = pingUseCase
    this._getVendorListUseCase = getVendorListUseCase
    this._getTCDataUseCase = getTCDataUseCase
    this._addEventListenerUseCase = addEventListenerUseCase
    this._removeEventListenerUseCase = removeEventListenerUseCase
  }

  getTCData(callback, vendorIds) {
    callback(this._getTCDataUseCase.execute({vendorIds}), true)
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
    const translationLanguage = 'es' // TODO: extract
    return this._getVendorListUseCase
      .execute({vendorListVersion, translationLanguage})
      .then(vendorList => callback(vendorList, true))
      .catch(error => {
        console.log('Error obtaining the vendor list', error)
        callback(null, false)
      })
  }
}

export {TcfApiV2}
