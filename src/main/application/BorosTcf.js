import {inject} from '../core/ioc/ioc'

import {GetVendorListUseCase} from './vendor_list/GetVendorListUseCase'
import {GetConsentStatusUseCase} from './vendor_consent/GetConsentStatusUseCase'
import {LoadUserConsentUseCase} from './vendor_consent/LoadUserConsentUseCase'
import {SaveUserConsentUseCase} from './vendor_consent/SaveUserConsentUseCase'

class BorosTcf {
  constructor({
    getVendorListUseCase = new GetVendorListUseCase() /*inject(GetVendorListUseCase)*/,
    getConsentStatusUseCase = new GetConsentStatusUseCase() /*inject(GetConsentStatusUseCase)*/,
    loadUserConsentUseCase = new LoadUserConsentUseCase() /*inject(LoadUserConsentUseCase)*/,
    saveUserConsentUseCase = new  SaveUserConsentUseCase() /*inject(SaveUserConsentUseCase)*/
  } = {}) {
    this.getVendorListUseCase = getVendorListUseCase
    this.getConsentStatusUseCase = getConsentStatusUseCase
    this.loadUserConsentUseCase = loadUserConsentUseCase
    this.saveUserConsentUseCase = saveUserConsentUseCase
  }

  getVendorList() {
    return this.getVendorListUseCase.execute()
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
