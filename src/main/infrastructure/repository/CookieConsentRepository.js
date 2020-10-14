import {ConsentRepository} from '../../domain/consent/ConsentRepository'
import {inject} from '../../core/ioc/ioc'

class CookieConsentRepository extends ConsentRepository {
  constructor(
    euconsentCookieStorage = inject('euconsentCookieStorage'),
    borosTcfCookieStorage = inject('borosTcfCookieStorage')
  ) {
    super()
    this._euconsentCookieStorage = euconsentCookieStorage
    this._borosTcfCookieStorage = borosTcfCookieStorage
  }

  loadUserConsent() {
    return this._euconsentCookieStorage.load() || ''
  }

  saveUserConsent({encodedConsent, decodedConsent}) {
    this._euconsentCookieStorage.save({data: encodedConsent})
    this._borosTcfCookieStorage.save({data: decodedConsent})
  }
}

export {CookieConsentRepository}
