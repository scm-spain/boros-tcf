import {CookieStorage} from './CookieStorage'

export class BrowserCookieStorage extends CookieStorage {
  constructor({
    window,
    cookieName,
    cookieDefaultPath,
    CookieMaxAge,
    CookieSameSiteVlue
  }) {
    super()
    this._window = window
    this._cookieName = cookieName
    this._cookieDefaultPath = cookieDefaultPath
    this._CookieMaxAge = CookieMaxAge
    this._CookieSameSiteVlue = CookieSameSiteVlue
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
      `path=${this._cookieDefaultPath}`,
      `max-age=${this._CookieMaxAge}`,
      `SameSite=${this._CookieSameSiteVlue}`
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
      `path=${this._cookieDefaultPath}`,
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
      tcfPolicyVersion,
      cmpVersion,
      purpose: {consents},
      specialFeatureOptions
    } = data
    const usedData = {
      tcfPolicyVersion,
      cmpVersion,
      purpose: {consents},
      specialFeatureOptions
    }
    return JSON.stringify(usedData)
  }
}

const DOT = '.'
