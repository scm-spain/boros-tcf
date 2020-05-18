import {CookieStorage} from './CookieStorage'

class BrowserCookieStorage extends CookieStorage {
  save({key, data}) {
    // TODO
    /* return Promise.all([
      Promise.resolve(maxAgeSeconds ? `;max-age=${maxAgeSeconds}` : ''),
      Promise.resolve(cookieDomain ? `;domain=${cookieDomain}` : ''),
      Promise.resolve(secure ? `;${secure}` : '')
    ])
      .then(
        ([maxAge, domain, secure]) =>
          `${cookieName}=${value}${domain};path=${path}${maxAge};SameSite=${sameSite}${secure}`
      )
      .then(cookieValue => (this._dom.cookie = cookieValue)) */
    window.document.cookie = `${key}=${data}`
  }
}

export {BrowserCookieStorage}
