import 'jsdom-global/register'
import {expect} from 'chai'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {TestableHttpClientMock} from '../testable/infrastructure/repository/TestableHttpClientMock'
import {HttpClient} from '../../main/infrastructure/repository/http/HttpClient'
import {VendorListValue} from '../fixtures/vendorlist/VendorListValue'
import {TestableCookieStorageMock} from '../testable/infrastructure/repository/TestableCookieStorageMock'
import {CookieStorage} from '../../main/infrastructure/repository/cookie/CookieStorage'

describe('BorosTcf', () => {
  describe('getVendorList use case', () => {
    let httpClientMock
    let borosTcf
    beforeEach(() => {
      httpClientMock = new TestableHttpClientMock()
      borosTcf = TestableTcfApiInitializer.create()
        .mock(HttpClient, httpClientMock)
        .init()
    })

    it('should return the untranslated latest vendor list if nothing is specified', async () => {
      httpClientMock.setResolver(() => VendorListValue)
      const vendorList = await borosTcf.getVendorList()
      expect(httpClientMock.requests).to.have.length(1)
      const request = httpClientMock.requests[0]
      expect(request.url).to.include('/v2/vendorlist/LATEST?language=en')
      expect(vendorList).to.deep.equal(VendorListValue.data)
    })

    it('should return the translation of a specific version if parameters are specified', async () => {
      httpClientMock.setResolver(() => VendorListValue)
      const givenVersion = 33
      const givenLanguage = 'es'
      const vendorList = await borosTcf.getVendorList({
        version: givenVersion,
        language: givenLanguage
      })
      expect(httpClientMock.requests).to.have.length(1)
      const request = httpClientMock.requests[0]
      expect(request.url).to.include(
        `/v2/vendorlist/${givenVersion}?language=${givenLanguage}`
      )
      expect(vendorList).to.deep.equal(VendorListValue.data)
    })

    it('should cache the remote vendor list if same version and language are requested', async () => {
      httpClientMock.setResolver(() => VendorListValue)
      await borosTcf.getVendorList()
      await borosTcf.getVendorList({
        version: 10,
        language: 'es'
      })
      await borosTcf.getVendorList({version: 'LATEST'})
      await borosTcf.getVendorList({
        version: 10,
        language: 'es'
      })
      expect(httpClientMock.requests).to.have.length(2)
      expect(httpClientMock.requests[0].url).to.include(
        `/v2/vendorlist/LATEST?language=en`
      )
      expect(httpClientMock.requests[1].url).to.include(
        `/v2/vendorlist/10?language=es`
      )
    })
  })
  describe('saveUserConsent', () => {
    let borosTcf
    let cookieStorageMock
    beforeEach(() => {
      cookieStorageMock = new TestableCookieStorageMock()
      borosTcf = TestableTcfApiInitializer.create()
        .mock(CookieStorage, cookieStorageMock)
        .init()
    })

    it('should work', () => {
      const givenPurpose = {}
      const givenVendor = {}
      borosTcf.saveUserConsent({purpose: givenPurpose, vendor: givenVendor})

      const savedConsent = cookieStorageMock.storage.get('euconsentv2')
      const userConsent = JSON.parse(savedConsent)
      expect(userConsent.purpose).to.not.undefined
      expect(userConsent.vendor).to.not.undefined
    })
  })
})
