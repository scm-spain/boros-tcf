import {inject} from '../core/ioc/ioc'

import {GetVendorListUseCase} from './services/vendorlist/GetVendorListUseCase'
import {LoadUserConsentUseCase} from './services/vendorconsent/LoadUserConsentUseCase'
import {SaveUserConsentUseCase} from './services/vendorconsent/SaveUserConsentUseCase'
import {ChangeUiVisibleUseCase} from './services/ui/ChangeUiVisibleUseCase'
import {GetTCDataUseCase} from './services/tcdata/GetTCDataUseCase'

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
    getVendorListUseCase = inject(GetVendorListUseCase),
    loadUserConsentUseCase = inject(LoadUserConsentUseCase),
    saveUserConsentUseCase = inject(SaveUserConsentUseCase),
    getTCDataUseCase = inject(GetTCDataUseCase),
    changeUiVisibleUseCase = inject(ChangeUiVisibleUseCase)
  } = {}) {
    this._getVendorListUseCase = getVendorListUseCase
    this._loadUserConsentUseCase = loadUserConsentUseCase
    this._saveUserConsentUseCase = saveUserConsentUseCase
    this._getTCDataUseCase = getTCDataUseCase
    this._changeUiVisibleUseCase = changeUiVisibleUseCase
  }

  /**
   * @param {Object} param
   * @param {Number} param.version
   * @param {String} param.language
   */
  getVendorList({version, language} = {}) {
    return this._getVendorListUseCase.execute({
      vendorListVersion: version,
      translationLanguage: language
    })
  }

  loadUserConsent() {
    return this._loadUserConsentUseCase.execute()
  }

  uiVisible({visible}) {
    this._changeUiVisibleUseCase.execute({visible})
  }

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
