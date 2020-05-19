import {inject} from '../core/ioc/ioc'

import {GetVendorListUseCase} from './services/vendorlist/GetVendorListUseCase'
import {LoadUserConsentUseCase} from './services/vendorconsent/LoadUserConsentUseCase'
import {SaveUserConsentUseCase} from './services/vendorconsent/SaveUserConsentUseCase'

class BorosTcf {
  /**
   * @param {GetVendorListUseCase} getVendorListUseCase
   * @param {LoadUserConsentUseCase} loadUserConsentUseCase
   * @param {SaveUserConsentUseCase} saveUserConsentUseCase
   */
  constructor({
    getVendorListUseCase = inject(GetVendorListUseCase),
    loadUserConsentUseCase = inject(LoadUserConsentUseCase),
    saveUserConsentUseCase = inject(SaveUserConsentUseCase)
  } = {}) {
    this.getVendorListUseCase = getVendorListUseCase
    this.loadUserConsentUseCase = loadUserConsentUseCase
    this.saveUserConsentUseCase = saveUserConsentUseCase
  }

  getVendorList({version, language} = {}) {
    return this.getVendorListUseCase.execute({
      vendorListVersion: version,
      translationLanguage: language
    })
  }

  loadUserConsent() {
    return this.loadUserConsentUseCase.execute()
  }

  async saveUserConsent({purpose, vendor, specialFeatures}) {
    return this.saveUserConsentUseCase.execute({
      purpose,
      vendor,
      specialFeatures
    })
  }
}

export {BorosTcf}
