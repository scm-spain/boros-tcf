import {CookieStorage} from './CookieStorage'
import {
  VENDOR_CONSENT_COOKIE_DEFAULT_PATH,
  VENDOR_CONSENT_COOKIE_MAX_AGE,
  VENDOR_CONSENT_COOKIE_SAME_SITE_LOCAL_VALUE
} from '../../../core/constants'

export class BrowserCookieStorage extends CookieStorage {
  constructor({window, cookieName}) {
    super()
    this._window = window
    this._cookieName = cookieName
  }

  load() {
    this._replaceSubdomainCookie()
    const cookies = this._getConsentCookies()
    return cookies.length ? cookies[0].split('=')[1] : undefined
  }

  save({data}) {
    if (typeof data !== 'string') {
      data = this._parseData({data})
    }
    const domain = this._parseDomain()
    const cookieValue = [
      `${this._cookieName}=${data}`,
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
      `${this._cookieName}=`,
      `path=${VENDOR_CONSENT_COOKIE_DEFAULT_PATH}`,
      `domain=${host}`,
      `expires= Thu, 01 Jan 1970 00:00:00 GMT`
    ]
    this._window.document.cookie = cookieParts.join(';') // delete cookie with subdomain
    const consentCookiesAfterDeletion = this._getConsentCookies()
    if (!consentCookiesAfterDeletion.length) {
      this.save({data})
    }
  }

  _getConsentCookies() {
    const cookies = `; ${this._window.document.cookie}`.split(';')
    const consentCookies = cookies
      .filter(cookie => cookie.includes(`${this._cookieName}=`))
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

  _parseData({data}) {
    const {
      policyVersion,
      cmpVersion,
      purpose: {consents},
      specialFeatureOptions
    } = data
    const usedData = {
      policyVersion,
      cmpVersion,
      purpose: {consents},
      specialFeatureOptions
    }
    return JSON.stringify(usedData)
  }
}

const DOT = '.'
