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
  const givenSpecialFeatures = {1: true, 2: false, 3: true}

  it('should return all props correctly setted', done => {
    const cookieStorageMock = new TestableCookieStorageMock()
    const eventStatusServiceMock = {
      getEventStatus: () => ({code: EventStatus.TCLOADED})
    }
    const cmpStatusRepositoryMock = {
      getCmpStatus: () => {
        return {
          code: CmpStatus.LOADED
        }
      }
    }
    const displayStatusRepositoryMock = {
      getDisplayStatus: () => {
        return {
          code: DisplayStatus.VISIBLE
        }
      }
    }
    const borosTcf = TestableTcfApiInitializer.create()
      .mock(CookieStorage, cookieStorageMock)
      .mock(CmpStatusRepository, cmpStatusRepositoryMock)
      .mock(DisplayStatusRepository, displayStatusRepositoryMock)
      .mock(EventStatusService, eventStatusServiceMock)
      .init()

    const expectedVendor = {
      consents: {'1': true},
      legitimateInterests: {'1': false, '2': false, '3': true}
    }
    const expectedPurpose = {
      consents: {1: true, 2: false, 3: true},
      legitimateInterests: {1: false, 2: false, 3: true}
    }
    const expectedSpecialFeatures = givenSpecialFeatures
    const expectedEmptyOutOfBand = {
      allowedVendors: {},
      disclosedVendors: {}
    }
    const expectedPublisher = {
      consents: {},
      legitimateInterests: {},
      customPurpose: {
        consents: {},
        legitimateInterests: {}
      },
      restrictions: {}
    }

    borosTcf
      .saveUserConsent({
        purpose: givenPurpose,
        vendor: givenVendor,
        specialFeatures: givenSpecialFeatures
      })
      .then(() => cookieStorageMock.load())
      .then(cookie =>
        window.__tcfapi(command, version, (tcData, success) => {
          expect(success).to.be.true
          const tcDataValue = tcData.value()
          const {
            tcString,
            gdprApplies,
            eventStatus,
            cmpStatus,
            outOfBand,
            purpose,
            vendor,
            specialFeatureOptins,
            publisher
          } = tcDataValue
          debugger
          expect(tcString).to.be.equal(cookie)
          expect(gdprApplies).to.be.true
          expect(eventStatus).to.be.equal(EventStatus.TCLOADED)
          expect(cmpStatus).to.be.equal(CmpStatus.LOADED)
          expect(outOfBand).to.be.deep.equal(expectedEmptyOutOfBand)
          expect(purpose).to.deep.equal(expectedPurpose)
          expect(vendor).to.deep.equal(expectedVendor)
          expect(specialFeatureOptins).to.deep.equal(expectedSpecialFeatures)
          expect(publisher).to.deep.equal(expectedPublisher)
          done()
        })
      )
  })
})
