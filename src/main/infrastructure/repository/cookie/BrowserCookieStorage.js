import {CookieStorage} from './CookieStorage'

export class BrowserCookieStorage extends CookieStorage {
  constructor({window} = {}) {
    super()
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
    const domain = this._parseDomain()
    const cookieValue = [
      `${VENDOR_CONSENT_COOKIE_NAME}=${data}`,
      `domain=${domain}`,
      `path=${VENDOR_CONSENT_COOKIE_DEFAULT_PATH}`,
      `max-age=${VENDOR_CONSENT_COOKIE_MAX_AGE}`,
      `SameSite=${VENDOR_CONSENT_COOKIE_SAME_SITE_LOCAL_VALUE}`
    ].join(';')
    this._window.document.cookie = cookieValue
  }

  _parseDomain() {
    const host = this._window.location.hostname || ''
    const parts = host.split(DOT)
    if (parts.length > 2) {
      parts.shift()
    }
    return `${DOT}${parts.join('.')}`
  }
}

const VENDOR_CONSENT_COOKIE_NAME = 'euconsent-v2'
const VENDOR_CONSENT_COOKIE_MAX_AGE = 33696000
const VENDOR_CONSENT_COOKIE_DEFAULT_PATH = '/'
const VENDOR_CONSENT_COOKIE_SAME_SITE_LOCAL_VALUE = 'Lax'
const DOT = '.'
