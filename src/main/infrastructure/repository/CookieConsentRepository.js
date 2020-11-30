import {ConsentRepository} from '../../domain/consent/ConsentRepository'
import {inject} from '../../core/ioc/ioc'

class CookieConsentRepository extends ConsentRepository {
  constructor({
    window,
    scope,
    euconsentCookieStorage = inject('euconsentCookieStorage'),
    borosTcfCookieStorage = inject('borosTcfCookieStorage')
  } = {}) {
    super()
    this._window = window
    this._scope = scope
    this._euconsentCookieStorage = euconsentCookieStorage
    this._borosTcfCookieStorage = borosTcfCookieStorage
  }

  loadUserConsent() {
    try {
      return this._euconsentCookieStorage.load() || ''
    } catch (error) {
      return ''
    }
  }

  saveUserConsent({encodedConsent, decodedConsent}) {
    this._euconsentCookieStorage.save({data: encodedConsent})
    try {
      const data = this._encodeBorosTcfData({data: decodedConsent})
      this._borosTcfCookieStorage.save({data})
    } catch (ignored) {}
  }

  _encodeBorosTcfData({data}) {
    const {policyVersion, cmpVersion, purpose, specialFeatures, vendor} = data
    const scopedInterestVendorConsents = this._scopedInterestConsentOnVendors({
      vendors: vendor.consents
    })
    const usedData = {
      policyVersion,
      cmpVersion,
      purpose: {consents: purpose.consents},
      specialFeatures,
      vendor: {
        consents: scopedInterestVendorConsents
      }
    }
    const stringData = JSON.stringify(usedData)
    const base64Data = this._window.btoa(stringData)
    return base64Data
  }

  _scopedInterestConsentOnVendors({vendors}) {
    const consents = {}
    const scopedVendors = this._scope?.interestConsentVendors || []
    scopedVendors.forEach(key => {
      consents[key] = vendors[key]
    })
    return consents
  }
}

export {CookieConsentRepository}
