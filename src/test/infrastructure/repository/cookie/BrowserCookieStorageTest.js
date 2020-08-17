import {BrowserCookieStorage} from '../../../../main/infrastructure/repository/cookie/BrowserCookieStorage'
import {expect} from 'chai'
import jsdom, {JSDOM} from 'jsdom'

describe('BrowserCookieStorage Should', () => {
  it('Write And read a cookie', () => {
    const window = new JSDOM('<!DOCTYPE html><body></body>', {
      url: 'http://example.com/'
    }).window
    const browserCookieStorage = new BrowserCookieStorage({
      window
    })

    browserCookieStorage.save({data: 'foo'})
    const cookie = browserCookieStorage.load()
    expect(cookie).equal('foo')
  })
  it('Write And read a cookie without domain', () => {
    const window = new JSDOM('<!DOCTYPE html><body></body>', {
      url: 'http://example.com/'
    }).window
    const browserCookieStorage = new BrowserCookieStorage({
      window
    })

    browserCookieStorage.save({data: 'foo'})
    const cookie = browserCookieStorage.load()
    expect(cookie).equal('foo')
  })
  it('Write And read a cookie with different domain should be undefined', () => {
    const givenCookie = 'foo'
    const dom1 = new JSDOM('<!DOCTYPE html><body></body>', {
      url: 'http://example1.com/'
    })
    const browserCookieStorage1 = new BrowserCookieStorage({
      window: dom1.window
    })
    const dom2 = new JSDOM('<!DOCTYPE html><body></body>', {
      url: 'http://example2.com/'
    })
    const browserCookieStorage2 = new BrowserCookieStorage({
      window: dom2.window
    })
    browserCookieStorage1.save({data: givenCookie})
    const cookie1 = browserCookieStorage1.load()
    const cookie2 = browserCookieStorage2.load()
    expect(cookie1).to.equal(givenCookie)
    expect(cookie2).to.be.undefined
  })
  it('Should keep the cookie between subdomains', () => {
    const givenHost = 'example.com'
    const givenCookie = 'foo'
    const cookieJar = new jsdom.CookieJar()
    const dom = new JSDOM('<!DOCTYPE html><body></body>', {
      url: `http://www.${givenHost}/`,
      cookieJar
    })
    const browserCookieStorage1 = new BrowserCookieStorage({
      window: dom.window
    })
    browserCookieStorage1.save({data: givenCookie})
    dom.reconfigure({url: `http://asubdomainof.${givenHost}/`})
    const browserCookieStorage2 = new BrowserCookieStorage({
      window: dom.window
    })
    const cookie2 = browserCookieStorage2.load()
    expect(cookie2).to.equal(givenCookie)
    expect(cookieJar.getCookiesSync(`http://${givenHost}/`)).to.have.lengthOf(1)
  })
})
