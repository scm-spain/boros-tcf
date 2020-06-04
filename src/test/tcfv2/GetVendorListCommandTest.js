import 'jsdom-global/register'
import {expect} from 'chai'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {GVLFactory} from '../../main/infrastructure/repository/iab/GVLFactory'
import {
  TestableGVLFactory,
  UNAVAILABLE_VERSION
} from '../testable/infrastructure/repository/iab/TestableGVLFactory'
import {VendorListValue} from '../fixtures/vendorlist/VendorListValue'

/**
 * @see https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md#getvendorlist
 */
describe('getVendorList', () => {
  const givenCommand = 'getVendorList'
  const givenVersion = 2

  beforeEach(() => {
    TestableTcfApiInitializer.create()
      .mock(GVLFactory, new TestableGVLFactory())
      .init()
  })

  it('should succeed if vendor list value is returned', done => {
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
    const givenVendorListVersion = UNAVAILABLE_VERSION
    new Promise(resolve =>
      window.__tcfapi(
        givenCommand,
        givenVersion,
        (vendorList, success) => {
          resolve({vendorList, success})
        },
        givenVendorListVersion
      )
    )
      .then(({vendorList, success}) => {
        expect(success).to.be.false
        expect(vendorList).to.be.null
      })
      .then(() => done())
      .catch(error => done(error))
  })
})
