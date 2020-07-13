import 'jsdom-global/register'
import {expect} from 'chai'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {GVLFactory} from '../../main/infrastructure/repository/iab/GVLFactory'
import {
  TestableGVLFactory,
  UNAVAILABLE_VERSION
} from '../testable/infrastructure/repository/iab/TestableGVLFactory'
import {VendorListValueSpanish} from '../fixtures/vendorlist/VendorListValue'

/**
 * @see https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20CMP%20API%20v2.md#getvendorlist
 */
describe('getVendorList', () => {
  const givenCommand = 'getVendorList'
  const givenVersion = 2
  const initializeContainer = ({language} = {}) => {
    const testableGVLFactory = new TestableGVLFactory({language})
    testableGVLFactory.reset()
    TestableTcfApiInitializer.create()
      .mock(GVLFactory, testableGVLFactory)
      .init({language})
  }

  beforeEach(() => {
    initializeContainer()
  })

  it('should succeed if vendor list value is returned', done => {
    new Promise(resolve =>
      window.__tcfapi(givenCommand, givenVersion, (vendorList, success) => {
        resolve({vendorList, success})
      })
    )
      .then(({vendorList, success}) => {
        expect(success).to.be.true
        expect(vendorList.purposes[1]).to.be.deep.equal(
          VendorListValueSpanish.data.purposes[1]
        )
      })
      .then(() => done())
      .catch(error => done(error))
  })

  it('should not succeed if vendor list value cannot be returned due to an error', () => {
    const consoleLog = console.log
    const consoleError = console.error
    const givenVendorListVersion = UNAVAILABLE_VERSION
    console.log = () => null
    console.error = () => null
    return new Promise(resolve => {
      window.__tcfapi(
        givenCommand,
        givenVersion,
        (vendorList, success) => {
          resolve({vendorList, success})
        },
        givenVendorListVersion
      )
    })
      .then(({vendorList, success}) => {
        console.log = consoleLog
        console.error = consoleError
        expect(success).to.be.false
        expect(vendorList).to.be.null
      })
      .catch(e => {
        console.log = consoleLog
        console.error = consoleError
        throw e
      })
  })
})
