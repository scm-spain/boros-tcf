import {inject} from '../core/ioc/ioc'

import {GetVendorListUseCase} from './services/vendorlist/GetVendorListUseCase'
import {LoadUserConsentUseCase} from './services/vendorconsent/LoadUserConsentUseCase'
import {SaveUserConsentUseCase} from './services/vendorconsent/SaveUserConsentUseCase'
import {ChangeUiVisibleUseCase} from './services/ui/ChangeUiVisibleUseCase'

class BorosTcf {
  /**
   * @param {GetVendorListUseCase} getVendorListUseCase
   * @param {LoadUserConsentUseCase} loadUserConsentUseCase
   * @param {SaveUserConsentUseCase} saveUserConsentUseCase
   * @param {ChangeUiVisibleUseCase} changeUiVisibleUseCase
   */
  constructor({
    getVendorListUseCase = inject(GetVendorListUseCase),
    loadUserConsentUseCase = inject(LoadUserConsentUseCase),
    saveUserConsentUseCase = inject(SaveUserConsentUseCase),
    changeUiVisibleUseCase = inject(ChangeUiVisibleUseCase)
  } = {}) {
    this._getVendorListUseCase = getVendorListUseCase
    this._loadUserConsentUseCase = loadUserConsentUseCase
    this._saveUserConsentUseCase = saveUserConsentUseCase
    this._changeUiVisibleUseCase = changeUiVisibleUseCase
  }

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
}

export {BorosTcf}
