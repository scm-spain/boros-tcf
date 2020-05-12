import 'jsdom-global/register'
import {expect} from 'chai'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {TestableHttpClientMock} from '../testable/infrastructure/repository/TestableHttpClientMock'
import {HttpClient} from '../../main/infrastructure/repository/http/HttpClient'
import {VendorListValue} from '../fixtures/vendorlist/VendorListValue.js'

/**
 * @see https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md#getvendorlist
 */
describe('getVendorList', () => {
  const givenCommand = 'getVendorList'
  const givenVersion = 2

  let httpClientMock
  beforeEach(() => {
    httpClientMock = new TestableHttpClientMock()
    TestableTcfApiInitializer.create()
      .mock(HttpClient, httpClientMock)
      .init()
  })

  it('should succeed if vendor list value is returned', done => {
    httpClientMock.setResolver(() => VendorListValue)
    new Promise(resolve =>
      window.__tcfapi(givenCommand, givenVersion, (vendorList, success) => {
        resolve({vendorList, success})
      })
    )
      .then(({vendorList, success}) => {
        expect(success).to.be.true
        expect(vendorList).to.deep.equal(VendorListValue.data)
      })
      .then(() => done())
      .catch(error => done(error))
  })

  it('should not succeed if vendor list value cannot be returned due to an error', done => {
    httpClientMock.setResolver(() => new Error('fake network error'))
    new Promise(resolve =>
      window.__tcfapi(givenCommand, givenVersion, (vendorList, success) => {
        resolve({vendorList, success})
      })
    )
      .then(({vendorList, success}) => {
        expect(success).to.be.false
        expect(vendorList).to.be.null
      })
      .then(() => done())
      .catch(error => done(error))
  })

  it('should not accept invalid parameters', done => {
    const givenInvalidVersionParameter = 'patata'
    httpClientMock.setResolver(() => VendorListValue)
    new Promise(resolve =>
      window.__tcfapi(
        givenCommand,
        givenVersion,
        (vendorList, success) => {
          resolve({vendorList, success})
        },
        givenInvalidVersionParameter
      )
    )
      .then(({vendorList, success}) => {
        expect(
          httpClientMock.requests,
          'should validate before doing requests'
        ).to.have.length(0)
        expect(success).to.be.false
        expect(vendorList).to.be.null
      })
      .then(() => done())
      .catch(error => done(error))
  })
})
