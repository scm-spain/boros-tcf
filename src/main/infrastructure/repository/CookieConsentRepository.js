import {ConsentRepository} from '../../domain/consent/ConsentRepository'
import {inject} from '../../core/ioc/ioc'
import {CookieStorage} from './cookie/CookieStorage'

class CookieConsentRepository extends ConsentRepository {
  constructor(cookieStorage = inject(CookieStorage)) {
    super()
    this._cookieStorage = cookieStorage
  }

  loadUserConsent() {
    return this._cookieStorage.load()
  }

  saveUserConsent({consent}) {
    this._cookieStorage.save({data: consent})
  }
}

export {CookieConsentRepository}
