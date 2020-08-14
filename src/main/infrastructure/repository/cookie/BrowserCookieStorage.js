import {CookieStorage} from './CookieStorage'

class BrowserCookieStorage extends CookieStorage {
  constructor({domain = VENDOR_CONSENT_COOKIE_DEFAULT_DOMAIN, window} = {}) {
    super()
    this._domain = domain
    this._window = window
  }

  load() {
    const cookieParts = `; ${this._window.document.cookie}`.split(
      `; ${VENDOR_CONSENT_COOKIE_NAME}=`
    )
    return (
      (cookieParts.length === 2 &&
        cookieParts
          .pop()
          .split(';')
          .shift()) ||
      undefined
    )
  }

  save({data}) {
    const cookieValue = [
      `${VENDOR_CONSENT_COOKIE_NAME}=${data}`,
      this._domain && `domain=${this._domain}`,
      `path=${VENDOR_CONSENT_COOKIE_DEFAULT_PATH};max-age=${VENDOR_CONSENT_COOKIE_MAX_AGE};SameSite=${VENDOR_CONSENT_COOKIE_SAME_SITE_LOCAL_VALUE}`
    ]
      .filter(Boolean)
      .join(';')
    this._window.document.cookie = cookieValue
  }
}

export {BrowserCookieStorage}

const VENDOR_CONSENT_COOKIE_DEFAULT_DOMAIN = ''
const VENDOR_CONSENT_COOKIE_NAME = 'euconsent-v2'
const VENDOR_CONSENT_COOKIE_MAX_AGE = 33696000
const VENDOR_CONSENT_COOKIE_DEFAULT_PATH = '/'
const VENDOR_CONSENT_COOKIE_SAME_SITE_LOCAL_VALUE = 'Lax'
