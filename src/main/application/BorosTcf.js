import {inject} from '../core/ioc/ioc'

import {GetVendorListUseCase} from './services/vendorlist/GetVendorListUseCase'
import {GetConsentStatusUseCase} from './services/vendorconsent/GetConsentStatusUseCase'
import {LoadUserConsentUseCase} from './services/vendorconsent/LoadUserConsentUseCase'
import {SaveUserConsentUseCase} from './services/vendorconsent/SaveUserConsentUseCase'

class BorosTcf {
  /**
   * @param {GetVendorListUseCase} getVendorListUseCase
   * @param {GetConsentStatusUseCase} getConsentStatusUseCase
   * @param {LoadUserConsentUseCase} loadUserConsentUseCase
   * @param {SaveUserConsentUseCase} saveUserConsentUseCase
   */
  constructor({
    getVendorListUseCase = inject(GetVendorListUseCase),
    getConsentStatusUseCase = inject(GetConsentStatusUseCase),
    loadUserConsentUseCase = inject(LoadUserConsentUseCase),
    saveUserConsentUseCase = inject(SaveUserConsentUseCase)
  } = {}) {
    this.getVendorListUseCase = getVendorListUseCase
    this.getConsentStatusUseCase = getConsentStatusUseCase
    this.loadUserConsentUseCase = loadUserConsentUseCase
    this.saveUserConsentUseCase = saveUserConsentUseCase
  }

  getVendorList({version, language} = {}) {
    return this.getVendorListUseCase.execute({
      vendorListVersion: version,
      translationLanguage: language
    })
  }

  getConsentStatus() {
    return this.getConsentStatusUseCase.execute()
  }

  loadUserConsent() {
    return this.loadUserConsentUseCase.execute()
  }

  async saveUserConsent({purpose, vendor}) {
    return this.saveUserConsentUseCase.execute({purpose, vendor})
  }
}

export {BorosTcf}
