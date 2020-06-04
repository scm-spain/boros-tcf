import {CookieStorage} from './CookieStorage'

class BrowserCookieStorage extends CookieStorage {
  load() {
    const cookieParts = `; ${window.document.cookie}`.split(
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
    const cookieValue = `${VENDOR_CONSENT_COOKIE_NAME}=${data};domain=${VENDOR_CONSENT_COOKIE_DOMAIN};path=${VENDOR_CONSENT_COOKIE_DEFAULT_PATH};max-age=${VENDOR_CONSENT_COOKIE_MAX_AGE};SameSite=${VENDOR_CONSENT_COOKIE_SAME_SITE_LOCAL_VALUE}`
    window.document.cookie = cookieValue
  }
}

export {BrowserCookieStorage}

const VENDOR_CONSENT_COOKIE_DOMAIN = '*'
const VENDOR_CONSENT_COOKIE_NAME = 'euconsent-v2'
const VENDOR_CONSENT_COOKIE_MAX_AGE = 33696000
const VENDOR_CONSENT_COOKIE_DEFAULT_PATH = '/'
const VENDOR_CONSENT_COOKIE_SAME_SITE_LOCAL_VALUE = 'Lax'
