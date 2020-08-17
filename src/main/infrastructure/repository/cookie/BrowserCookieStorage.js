import {CookieStorage} from './CookieStorage'

export class BrowserCookieStorage extends CookieStorage {
  constructor({window}) {
    super()
    this._window = window
  }

  load() {
    this._replaceSubdomainCookie()
    const cookies = this._getConsentCookies()
    return cookies.length ? cookies[0].split('=')[1] : undefined
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

  _replaceSubdomainCookie() {
    const consentCookies = this._getConsentCookies()
    if (!consentCookies.length) {
      return
    }
    const data = consentCookies[0].split('=')[1]
    const host = this._window.location.hostname || ''
    const cookieParts = [
      `${VENDOR_CONSENT_COOKIE_NAME}=`,
      `path=${VENDOR_CONSENT_COOKIE_DEFAULT_PATH}`,
      `domain=${host}`,
      `expires= Thu, 01 Jan 1970 00:00:00 GMT`
    ]
    document.cookie = cookieParts.join(';') // delete cookie with subdomain
    const consentCookiesAfterDeletion = this._getConsentCookies()
    if (!consentCookiesAfterDeletion.length) {
      this.save({data})
    }
  }

  _getConsentCookies() {
    const cookies = `; ${this._window.document.cookie}`.split(';')
    const consentCookies = cookies
      .filter(cookie => cookie.includes(`${VENDOR_CONSENT_COOKIE_NAME}=`))
      .map(cookie => cookie.trim())
    return consentCookies
  }

  _parseDomain() {
    const host = this._window.location.hostname || ''
    const parts = host
      .split(DOT)
      .reverse()
      .filter((_, index) => index <= 1)
      .reverse()
    return `${DOT}${parts.join('.')}`
  }
}

const VENDOR_CONSENT_COOKIE_NAME = 'euconsent-v2'
const VENDOR_CONSENT_COOKIE_MAX_AGE = 33696000
const VENDOR_CONSENT_COOKIE_DEFAULT_PATH = '/'
const VENDOR_CONSENT_COOKIE_SAME_SITE_LOCAL_VALUE = 'Lax'
const DOT = '.'
