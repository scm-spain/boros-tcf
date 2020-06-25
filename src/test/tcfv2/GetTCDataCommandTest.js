import 'jsdom-global/register'
import {expect} from 'chai'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {CookieStorage} from '../../main/infrastructure/repository/cookie/CookieStorage'
import {TestableCookieStorageMock} from '../testable/infrastructure/repository/TestableCookieStorageMock'
import {Status} from '../../main/domain/status/Status'
import {StatusRepository} from '../../main/domain/status/StatusRepository'

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
    const statusMock = {
      eventStatus: Status.TCLOADED,
      cmpStatus: Status.CMPSTATUS_LOADED,
      displayStatus: Status.DISPLAYSTATUS_VISIBLE
    }
    const statusRepositoryMock = {
      getStatus: () => statusMock
    }
    const borosTcf = TestableTcfApiInitializer.create()
      .mock(CookieStorage, cookieStorageMock)
      .mock(StatusRepository, statusRepositoryMock)
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
          } = tcData
          expect(tcString).to.be.equal(cookie)
          expect(gdprApplies).to.be.true
          expect(eventStatus).to.be.equal(Status.TCLOADED)
          expect(cmpStatus).to.be.equal(Status.CMPSTATUS_LOADED)
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
