import {ConsentRepository} from '../../domain/consent/ConsentRepository'
import {inject} from '../../core/ioc/ioc'
import {CookieStorage} from './cookie/CookieStorage'

class CookieConsentRepository extends ConsentRepository {
  constructor(cookieStorage = inject(CookieStorage)) {
    super()
    this._cookieStorage = cookieStorage
  }

  loadUserConsent() {
    return this._cookieStorage.load({key: CONSENT_COOKIE_KEY})
  }

  saveUserConsent({consent}) {
    this._cookieStorage.save({key: CONSENT_COOKIE_KEY, data: consent})
  }
}

const CONSENT_COOKIE_KEY = 'euconsentv2'

export {CookieConsentRepository}
