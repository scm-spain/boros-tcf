import {BrowserCookieStorage} from '../../../../main/infrastructure/repository/cookie/BrowserCookieStorage'
import {expect} from 'chai'
import jsdom, {JSDOM} from 'jsdom'

describe('BrowserCookieStorage Should', () => {
  const buildCookieStorage = ({cookieName, window}) =>
    new BrowserCookieStorage({
      domain: window.location.hostname,
      window,
      cookieName
    })

  it('Write And read a cookie', () => {
    const window = new JSDOM('<!DOCTYPE html><body></body>', {
      url: 'http://example.com/'
    }).window
    const browserCookieStorage = buildCookieStorage({
      cookieName: 'euconsent-v2',
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
    const browserCookieStorage = buildCookieStorage({
      cookieName: 'euconsent-v2',
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
    const browserCookieStorage1 = buildCookieStorage({
      cookieName: 'euconsent-v2',
      window: dom1.window
    })
    const dom2 = new JSDOM('<!DOCTYPE html><body></body>', {
      url: 'http://example2.com/'
    })
    const browserCookieStorage2 = buildCookieStorage({
      cookieName: 'euconsent-v2',
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
    const browserCookieStorage1 = buildCookieStorage({
      cookieName: 'euconsent-v2',
      window: dom.window
    })
    browserCookieStorage1.save({data: givenCookie})
    dom.reconfigure({url: `http://asubdomainof.${givenHost}/`})
    const browserCookieStorage2 = buildCookieStorage({
      cookieName: 'euconsent-v2',
      window: dom.window
    })
    const cookie2 = browserCookieStorage2.load()
    expect(cookie2).to.equal(givenCookie)
    expect(cookieJar.getCookiesSync(`http://${givenHost}/`)).to.have.lengthOf(1)
  })
  it('Write and read a cookie with object as a data', () => {
    const window = new JSDOM('<!DOCTYPE html><body></body>', {
      url: 'http://example.com/'
    }).window
    const browserCookieStorage = buildCookieStorage({
      cookieName: 'borosTcf',
      window
    })
    const givenData = {
      policyVersion: 2,
      cmpVersion: 12,
      purpose: {consents: {1: true, 2: true, 3: false}},
      specialFeatureOptions: {1: true}
    }
    const expectedCookieData = JSON.stringify(givenData)

    browserCookieStorage.save({data: givenData})
    const cookie = browserCookieStorage.load()
    expect(cookie).equal(expectedCookieData)
  })
  it('Write and read a cookie with correct parsed data', () => {
    const window = new JSDOM('<!DOCTYPE html><body></body>', {
      url: 'http://example.com/'
    }).window
    const browserCookieStorage = buildCookieStorage({
      cookieName: 'borosTcf',
      window
    })
    const givenTcfPolicyVersion = 2
    const givenCmpVersion = 12
    const givenVendors = {1: true, 2: true, 3: false}
    const givenPurposes = {
      consents: {1: true, 2: true, 3: false},
      legitimateInterests: {1: true, 2: true, 3: false}
    }
    const givenSpecialFeatureOptions = {1: true}
    const givenData = {
      policyVersion: givenTcfPolicyVersion,
      cmpVersion: givenCmpVersion,
      vendors: givenVendors,
      purpose: givenPurposes,
      specialFeatureOptions: givenSpecialFeatureOptions
    }
    const expectedCookieData = JSON.stringify({
      policyVersion: givenTcfPolicyVersion,
      cmpVersion: givenCmpVersion,
      purpose: {consents: givenPurposes.consents},
      specialFeatureOptions: givenSpecialFeatureOptions
    })

    browserCookieStorage.save({data: givenData})
    const cookie = browserCookieStorage.load()
    expect(cookie).equal(expectedCookieData)
  })
})
