import {inject} from '../core/ioc/ioc'

import {GetVendorListUseCase} from './services/vendorlist/GetVendorListUseCase'
import {LoadUserConsentUseCase} from './services/vendorconsent/LoadUserConsentUseCase'
import {SaveUserConsentUseCase} from './services/vendorconsent/SaveUserConsentUseCase'
import {ChangeUiVisibleUseCase} from './services/ui/ChangeUiVisibleUseCase'
import {GetTCDataUseCase} from './services/tcdata/GetTCDataUseCase'
import {StatusRepository} from '../domain/status/StatusRepository'
import {Status} from '../domain/status/Status'
import {DomainEventBus} from '../domain/service/DomainEventBus'
import {EVENT_TCF_READY, LIB_TCF_VERSION} from '../core/constants'

class BorosTcf {
  /**
   * @param {Object} param
   * @param {GetVendorListUseCase} param.getVendorListUseCase
   * @param {LoadUserConsentUseCase} param.loadUserConsentUseCase
   * @param {SaveUserConsentUseCase} param.saveUserConsentUseCase
   * @param {ChangeUiVisibleUseCase} param.changeUiVisibleUseCase
   * @param {GetTCDataUseCase} param.getTCDataUseCase
   */
  constructor({
    domainEventBus = inject(DomainEventBus),
    getVendorListUseCase = inject(GetVendorListUseCase),
    loadUserConsentUseCase = inject(LoadUserConsentUseCase),
    saveUserConsentUseCase = inject(SaveUserConsentUseCase),
    getTCDataUseCase = inject(GetTCDataUseCase),
    changeUiVisibleUseCase = inject(ChangeUiVisibleUseCase),
    statusRepository = inject(StatusRepository)
  } = {}) {
    this._domainEventBus = domainEventBus
    this._getVendorListUseCase = getVendorListUseCase
    this._loadUserConsentUseCase = loadUserConsentUseCase
    this._saveUserConsentUseCase = saveUserConsentUseCase
    this._getTCDataUseCase = getTCDataUseCase
    this._changeUiVisibleUseCase = changeUiVisibleUseCase
    this._statusRepository = statusRepository
  }

  ready() {
    this._statusRepository.getStatus().cmpStatus = Status.CMPSTATUS_LOADED
    this._domainEventBus.raise({
      eventName: EVENT_TCF_READY,
      payload: {
        version: LIB_TCF_VERSION
      }
    })
  }

  /**
   * @param {Object} param
   * @param {Number} param.version
   */
  getVendorList({version} = {}) {
    return this._getVendorListUseCase.execute({
      vendorListVersion: version
    })
  }

  loadUserConsent({notify} = {}) {
    return this._loadUserConsentUseCase.execute({notify})
  }

  uiVisible({visible}) {
    this._changeUiVisibleUseCase.execute({visible})
  }

  /**
   *
   * @param {Object} param
   * @param {Object} param.purpose
   * @param {Object<Number, boolean>} param.purpose.consents
   * @param {Object<Number, boolean>} param.purpose.legitimateInterests
   * @param {Object} param.vendor
   * @param {Object<Number, boolean>} param.vendor.consents
   * @param {Object<Number, boolean>} param.vendor.legitimateInterests
   * @param {Object<Number, boolean>} param.specialFeatures
   */
  async saveUserConsent({purpose, vendor, specialFeatures}) {
    return this._saveUserConsentUseCase.execute({
      purpose,
      vendor,
      specialFeatures
    })
  }

  /**
   *
   * @param {Object} param
   * @param {Array<Number>} param.vendorIds
   */
  getTCData({vendorIds}) {
    return this._getTCDataUseCase.execute({vendorIds})
  }
}

export {BorosTcf}
