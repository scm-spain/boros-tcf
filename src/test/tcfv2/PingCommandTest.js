import 'jsdom-global/register'
import {expect} from 'chai'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {CookieStorage} from '../../main/infrastructure/repository/cookie/CookieStorage'
import {TestableCookieStorageMock} from '../testable/infrastructure/repository/TestableCookieStorageMock'

describe('ping', () => {
  const command = 'ping'
  const version = 2

  beforeEach(() => {
    window.__tcfapi_boros = undefined
  })

  it('should return a PingReturn object according to specs', done => {
    TestableTcfApiInitializer.create().init()
    window.__tcfapi(command, version, (pingReturn, success) => {
      expect(success).to.be.true
      const expectedPingReturnProperties = [
        'gdprApplies',
        'cmpLoaded',
        'cmpStatus',
        'displayStatus',
        'apiVersion',
        'cmpVersion',
        'cmpId',
        'gvlVersion',
        'tcfPolicyVersion'
      ]
      expect(pingReturn).to.have.all.keys(expectedPingReturnProperties)
      done()
    })
  })

  it('should return the fixed settings', done => {
    const expectedCmpId = 129
    const expectedApiVersion = '2.0'
    const expectedTcfPolicyVersion = 2
    const expectedCmpStatus = 'loaded'
    TestableTcfApiInitializer.create().init()
    window.__tcfapi(command, version, pingReturn => {
      expect(pingReturn.gdprApplies).to.be.true
      expect(pingReturn.cmpId).to.be.equal(expectedCmpId)
      expect(pingReturn.apiVersion).to.be.equal(expectedApiVersion)
      expect(pingReturn.tcfPolicyVersion).to.be.equal(expectedTcfPolicyVersion)
      expect(pingReturn.cmpStatus).to.be.equal(expectedCmpStatus)
      done()
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

    const {pingReturn} = await new Promise(resolve =>
      window.__tcfapi(command, version, pingReturn => {
        resolve({pingReturn})
      })
    )

    expect(pingReturn.gvlVersion).to.be.equal(vendorList.vendorListVersion)
  })
  it('should return undefined gvlVersion if there is no consent', async () => {
    const cookieStorageMock = new TestableCookieStorageMock()
    TestableTcfApiInitializer.create()
      .mock(CookieStorage, cookieStorageMock)
      .init()

    const {pingReturn} = await new Promise(resolve =>
      window.__tcfapi(command, version, pingReturn => {
        resolve({pingReturn})
      })
    )

    expect(pingReturn.gvlVersion).to.be.equal(undefined)
  })
})
