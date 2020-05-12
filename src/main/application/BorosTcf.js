import {inject} from '../core/ioc/ioc'

import {GetVendorListUseCase} from './services/vendorlist/GetVendorListUseCase'
import {GetConsentStatusUseCase} from './services/vendor_consent/GetConsentStatusUseCase'
import {LoadUserConsentUseCase} from './services/vendor_consent/LoadUserConsentUseCase'
import {SaveUserConsentUseCase} from './services/vendor_consent/SaveUserConsentUseCase'

class BorosTcf {
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

  saveUserConsent({purpose, vendor}) {
    this.saveUserConsentUseCase.execute({purpose, vendor})
  }
}

export {BorosTcf}
