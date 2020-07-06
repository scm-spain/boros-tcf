import {BrowserCookieStorage} from '../../../../main/infrastructure/repository/cookie/BrowserCookieStorage'
import {expect} from 'chai'
import {JSDOM} from 'jsdom'

describe.only('BrowserCookieStorage Should', () => {
  it('Write And read a cookie', () => {
    const window = new JSDOM('<!DOCTYPE html><body></body>', {
      url: 'http://example.com/'
    }).window
    const browserCookieStorage = new BrowserCookieStorage({
      domain: 'example.com',
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
    const window = new JSDOM('<!DOCTYPE html><body></body>', {
      url: 'http://example.com/'
    }).window
    const browserCookieStorage = new BrowserCookieStorage({
      domain: 'example2.com',
      window
    })

    browserCookieStorage.save({data: 'foo'})
    const cookie = browserCookieStorage.load()
    expect(cookie).equal(undefined)
  })
})
