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
    try {
      return this._euconsentCookieStorage.load() || ''
    } catch (error) {
      return ''
    }
  }

  saveUserConsent({encodedConsent, decodedConsent}) {
    this._euconsentCookieStorage.save({data: encodedConsent})
    try {
      this._borosTcfCookieStorage.save({data: decodedConsent})
    } catch (ignored) {}
  }
}

export {CookieConsentRepository}
