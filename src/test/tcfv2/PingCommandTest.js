import 'jsdom-global/register'
import {expect} from 'chai'
import {PingReturn} from '../../main/domain/ping/PingReturn'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {GVLFactory} from '../../main/infrastructure/repository/iab/GVLFactory'
import {TestableGVLFactory} from '../testable/infrastructure/repository/iab/TestableGVLFactory'
import {VendorListValue} from '../fixtures/vendorlist/VendorListValue'
import {CookieStorage} from '../../main/infrastructure/repository/cookie/CookieStorage'
import {TestableCookieStorageMock} from '../testable/infrastructure/repository/TestableCookieStorageMock'

describe('ping', () => {
  const command = 'ping'
  const version = 2
  it('should return a PingReturn object', () => {
    TestableTcfApiInitializer.create().init()
    window.__tcfapi(command, version, (pingReturn, success) => {
      expect(success).to.be.true
      expect(pingReturn).to.be.instanceOf(PingReturn)
    })
  })

  it('should return fixed settings', () => {
    const givenCmpId = 129
    TestableTcfApiInitializer.create().init()
    window.__tcfapi(command, version, pingReturn => {
      expect(pingReturn.gdprApplies).to.be.true
      expect(pingReturn.cmpId).to.be.equal(givenCmpId)
    })
  })

  it('should return gvlVersion', async () => {
    const givenPurpose = {
      consents: {},
      legitimateInterests: {}
    }
    const givenVendor = {
      consents: {},
      legitimateInterests: {}
    }
    const givenVersion = 2
    const cookieStorageMock = new TestableCookieStorageMock()
    const borosTcf = TestableTcfApiInitializer.create()
      .mock(CookieStorage, cookieStorageMock)
      .init()
    await borosTcf.saveUserConsent({purpose: givenPurpose, vendor: givenVendor})
    await borosTcf.getVendorList()
    const givenVendorListCommand = 'getVendorList'
    const {vendorList, success} = await new Promise(resolve =>
      window.__tcfapi(
        givenVendorListCommand,
        givenVersion,
        (vendorList, success) => {
          resolve({vendorList, success})
        }
      )
    )
    expect(success).to.be.true
    window.__tcfapi(command, version, pingReturn => {
      expect(pingReturn.gvlVersion).to.be.equal(vendorList.vendorListVersion)
    })
  })
})
