import {CookieStorage} from '../../../../main/infrastructure/repository/cookie/CookieStorage'

class TestableCookieStorageMock extends CookieStorage {
  constructor() {
    super()
    this._storage = new Map()
  }

  load() {
    return this._storage.get(VENDOR_CONSENT_COOKIE_NAME)
  }

  save({data}) {
    this._storage.set(VENDOR_CONSENT_COOKIE_NAME, data)
  }

  get storage() {
    return this._storage
  }
}

const VENDOR_CONSENT_COOKIE_NAME = 'euconsent-v2'
export {TestableCookieStorageMock}
