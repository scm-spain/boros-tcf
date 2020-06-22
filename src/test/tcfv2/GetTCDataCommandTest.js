import 'jsdom-global/register'
import {expect} from 'chai'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {CookieStorage} from '../../main/infrastructure/repository/cookie/CookieStorage'
import {TestableCookieStorageMock} from '../testable/infrastructure/repository/TestableCookieStorageMock'
import {CmpStatus} from '../../main/domain/status/CmpStatus'
import {CmpStatusRepository} from '../../main/domain/status/CmpStatusRepository'
import {DisplayStatusRepository} from '../../main/domain/status/DisplayStatusRepository'
import {DisplayStatus} from '../../main/domain/status/DisplayStatus'
import {EventStatus} from '../../main/domain/status/EventStatus'
import {EventStatusService} from '../../main/domain/service/EventStatusService'

describe('getTCData', () => {
  const command = 'getTCData'
  const version = 2
  const givenPurpose = {
    consents: {1: true, 2: false, 3: true},
    legitimateInterests: {2: false, 3: true}
  }
  const givenVendor = {
    consents: {1: true, 2: false, 3: false},
    legitimateInterests: {1: false, 2: false, 3: true}
  }
  const expectedVendor = {
    consents: {'1': true},
    legitimateInterests: {'1': false, '2': false, '3': true}
  }
  const expectedPurpose = {
    consents: {1: true, 2: false, 3: true},
    legitimateInterests: {1: false, 2: false, 3: true}
  }
  it('should sucess', () => {
    const cookieStorageMock = new TestableCookieStorageMock()
    const eventStatusService = {
      getEventStatus: () => ({code: EventStatus.TCLOADED})
    }
    const cmpStatusRepository = {
      getCmpStatus: () => {
        return {
          code: CmpStatus.LOADED
        }
      }
    }
    const displayStatusRepository = {
      getDisplayStatus: () => {
        return {
          code: DisplayStatus.VISIBLE
        }
      }
    }
    const borosTcf = TestableTcfApiInitializer.create()
      .mock(CookieStorage, cookieStorageMock)
      .mock(CmpStatusRepository, cmpStatusRepository)
      .mock(DisplayStatusRepository, displayStatusRepository)
      .mock(EventStatusService, eventStatusService)
      .init()
    return borosTcf
      .saveUserConsent({purpose: givenPurpose, vendor: givenVendor})
      .then(() =>
        window.__tcfapi(command, version, (tcData, success) => {
          // TODO: implement
          expect(success).to.be.true
          const tcDataValue = tcData.value()
          expect(tcDataValue.vendor).to.deep.equal(expectedVendor)
          expect(tcDataValue.purpose).to.deep.equal(expectedPurpose)
          expect(tcDataValue.cmpStatus).to.be.equal(CmpStatus.LOADED)
        })
      )
  })
})
