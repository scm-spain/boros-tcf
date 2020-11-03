import 'jsdom-global/register'
import {expect} from 'chai'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {TestableCookieStorageMock} from '../testable/infrastructure/repository/TestableCookieStorageMock'
import {
  BOROS_TCF_ID,
  BOROS_TCF_VERSION,
  TCF_API_VERSION
} from '../../main/core/constants'
import {GVLFactory} from '../../main/infrastructure/repository/iab/GVLFactory'
import {
  GVL_EN_LANGUAGE,
  LATEST_GVL_EN_DATA,
  LATEST_GVL_ES_DATA,
  LATEST_GVL_VERSION,
  OLDEST_GVL_EN_DATA,
  OLDEST_GVL_ES_DATA,
  OLDEST_GVL_VERSION
} from '../testable/infrastructure/repository/iab/TestableGVLFactory'
import {DomainEventBus} from '../../main/domain/service/DomainEventBus'
import sinon from 'sinon'
import {VendorListRepository} from '../../main/domain/vendorlist/VendorListRepository'

import {Status} from '../../main/domain/status/Status'
import {StatusRepository} from '../../main/domain/status/StatusRepository'
import {waitCondition} from '../../main/core/service/waitCondition'
import {
  iabDecodeConsent,
  iabEncodeConsent
} from '../testable/infrastructure/consent/IABConsentUtils'
import {inject} from '../../main/core/ioc/ioc'
import {ConsentRepository} from '../../main/domain/consent/ConsentRepository'
import {COOKIE} from '../fixtures/cookie'
import {VendorList} from '../../main/domain/vendorlist/VendorList'

describe('BorosTcf', () => {
  const vendorListWithoutDate = vendorList => {
    const {lastUpdated, ...rest} = vendorList
    return rest
  }
  beforeEach(() => {
    window.__tcfapi_boros = undefined
  })

  describe('getVendorList use case', () => {
    const initBoros = ({language} = {}) =>
      TestableTcfApiInitializer.create().init({language})

    it('should return the spanish latest vendor list if nothing (language, version) is specified', async () => {
      const borosTcf = initBoros()
      const vendorList = await borosTcf.getVendorList()

      expect(vendorListWithoutDate(vendorList)).to.deep.equal(
        vendorListWithoutDate(LATEST_GVL_ES_DATA.vendorList)
      )
    })

    it('should return the boros initialized language vendor list', async () => {
      const givenLanguage = GVL_EN_LANGUAGE

      const borosTcf = initBoros({language: givenLanguage})
      const vendorList = await borosTcf.getVendorList()

      expect(vendorListWithoutDate(vendorList)).to.deep.equal(
        vendorListWithoutDate(LATEST_GVL_EN_DATA.vendorList)
      )
    })

    it('should return an oldest vendor list', async () => {
      const givenLanguage = GVL_EN_LANGUAGE
      const givenVersion = OLDEST_GVL_VERSION

      const borosTcf = initBoros({language: givenLanguage})
      const vendorList = await borosTcf.getVendorList({version: givenVersion})

      expect(vendorListWithoutDate(vendorList)).to.deep.equal(
        vendorListWithoutDate(OLDEST_GVL_EN_DATA.vendorList)
      )
    })
  })

  describe('saveUserConsent', () => {
    it('should save a new consent with the latest vendor list', async () => {
      const givenGvlVersion = LATEST_GVL_VERSION
      const givenConsent = iabDecodeConsent({
        encodedConsent: COOKIE.LATEST_GVL_ALL_ACCEPTED
      })
      const borosTcf = TestableTcfApiInitializer.create({
        latestGvlVersion: givenGvlVersion
      }).init()

      await borosTcf.saveUserConsent(givenConsent)

      const cookieRepsitory = inject(ConsentRepository)
      const cookieConsent = cookieRepsitory.loadUserConsent()
      const decodedCookie = iabDecodeConsent({encodedConsent: cookieConsent})

      expect(decodedCookie).to.deep.equal(givenConsent)
    })

    it('should replace an old consent and save new one with the latest vendor list', async () => {
      const givenGvlVersion = LATEST_GVL_VERSION
      const givenOldConsentCookie = COOKIE.OLDEST_GVL_ALL_ACCEPTED

      const givenConsent = iabDecodeConsent({
        encodedConsent: COOKIE.OLDEST_GVL_ALL_REJECTED
      })

      const cookieStorageMock = new TestableCookieStorageMock()
      cookieStorageMock.save({data: givenOldConsentCookie})

      const borosTcf = TestableTcfApiInitializer.create({
        latestGvlVersion: givenGvlVersion
      })
        .mock('euconsentCookieStorage', cookieStorageMock)
        .init()

      await borosTcf.saveUserConsent(givenConsent)

      const cookieRepsitory = inject(ConsentRepository)
      const cookieConsent = cookieRepsitory.loadUserConsent()
      const decodedCookie = iabDecodeConsent({encodedConsent: cookieConsent})

      const {
        vendorListVersion: givenConsentGvlVersion,
        ...restOfGivenConsent
      } = givenConsent
      const {
        vendorListVersion: decodedCookieGvlVersion,
        ...restOfDecodedCookie
      } = decodedCookie
      expect(givenConsentGvlVersion).to.equal(OLDEST_GVL_VERSION)
      expect(decodedCookieGvlVersion).to.equal(LATEST_GVL_VERSION)
      expect(restOfDecodedCookie).to.deep.equal(restOfGivenConsent)
    })
  })
  describe('loadUserConsent', () => {
    const initBoros = ({givenCookie} = {}) => {
      const cookieStorageMock = new TestableCookieStorageMock()
      givenCookie && cookieStorageMock.save({data: givenCookie})

      return TestableTcfApiInitializer.create()
        .mock('euconsentCookieStorage', cookieStorageMock)
        .init()
    }

    const validateConsentHasCommonData = ({
      consent,
      expectedVendorListVersion = LATEST_GVL_VERSION
    } = {}) => {
      expect(consent.cmpId).to.equal(BOROS_TCF_ID)
      expect(consent.cmpVersion).to.equal(BOROS_TCF_VERSION)
      expect(consent.policyVersion).to.equal(TCF_API_VERSION)
      expect(consent.vendorListVersion).to.equal(expectedVendorListVersion)
      expect(consent.publisherCC).to.have.length(2)
      expect(consent.isServiceSpecific).to.be.true
      expect(consent.useNonStandardStacks).to.be.false
      expect(consent.purposeOneTreatment).to.be.false
      expect(consent.purposeOneTreatment).to.be.false
      expect(consent.vendor).to.not.undefined
      expect(consent.purpose).to.not.undefined
      expect(consent.specialFeatures).to.not.undefined
      expect(consent.publisher).to.not.undefined
    }

    const validateCookieIsRenewedWithLoadedConsent = async ({consent}) => {
      const gvlFactory = inject(GVLFactory)
      const consentRepository = inject(ConsentRepository)
      const encodedConsent = await iabEncodeConsent({
        decodedConsent: consent,
        gvlFactory
      })
      const decodedConsentReturned = iabDecodeConsent({encodedConsent})
      const decodedConsentSaved = iabDecodeConsent({
        encodedConsent: consentRepository.loadUserConsent()
      })
      expect(decodedConsentSaved).to.deep.equal(decodedConsentReturned)
    }

    const validateConsentAllLastVendorsTo = async ({
      consent,
      consentsTo,
      legitimateInterestsTo
    }) => {
      expect(consent.vendorListVersion).to.equal(LATEST_GVL_VERSION)
      const vendorListRepository = inject(VendorListRepository)
      const latestVendorList = await vendorListRepository.getVendorList()
      Object.keys(latestVendorList.vendors).forEach(id => {
        expect(consent.vendor.consents[id], `no consent: ${id}`).to.equal(
          consentsTo
        )
        expect(
          consent.vendor.legitimateInterests[id],
          `no legInt: ${id}`
        ).to.equal(legitimateInterestsTo)
      })
    }

    describe('given an existing cookie saved with latest vendor list', () => {
      const givenCookie = COOKIE.LATEST_GVL_ALL_ACCEPTED

      it('should load the consent as valid', async () => {
        const borosTcf = initBoros({givenCookie})
        const consent = await borosTcf.loadUserConsent()

        const {valid, isNew, ...restOfConsent} = consent
        expect(valid).to.be.true
        expect(isNew).to.be.false

        const decodedExistingConsent = iabDecodeConsent({
          encodedConsent: givenCookie
        })
        expect(restOfConsent).to.deep.equal(decodedExistingConsent)
      })
      it('should return new consent if reading the cookie throws an error', async () => {
        const cookieStorageMock = {
          load: () => {
            throw new Error('Failed to read cookie')
          }
        }
        const borosTcf = TestableTcfApiInitializer.create()
          .mock('euconsentCookieStorage', cookieStorageMock)
          .init()
        const consent = await borosTcf.loadUserConsent()

        const {valid, isNew} = consent
        expect(valid).to.be.false
        expect(isNew).to.be.true

        validateConsentHasCommonData({consent})
      })
    })

    describe('given an existing cookie saved with older vendor list', () => {
      it('should return new consent if policy version has changed', async () => {
        const givenCookie = COOKIE.OLDEST_GVL_ALL_ACCEPTED
        const cookieStorageMock = new TestableCookieStorageMock()
        cookieStorageMock.save({data: givenCookie})
        const vendorListRepositoryMock = {
          getVendorList: async ({version} = {}) => {
            let gvl
            if (version === OLDEST_GVL_VERSION) {
              gvl = OLDEST_GVL_ES_DATA
            } else {
              const changedGVL = {...LATEST_GVL_ES_DATA}
              changedGVL.tcfPolicyVersion = changedGVL.tcfPolicyVersion + 1
              gvl = changedGVL
            }
            return new VendorList({
              version: gvl.vendorListVersion,
              policyVersion: gvl.tcfPolicyVersion,
              value: gvl
            })
          }
        }

        const borosTcf = TestableTcfApiInitializer.create()
          .mock('euconsentCookieStorage', cookieStorageMock)
          .mock(VendorListRepository, vendorListRepositoryMock)
          .init()

        const consent = await borosTcf.loadUserConsent()
        const {valid, isNew} = consent

        expect(valid).to.be.false
        expect(isNew).to.be.true
        validateConsentHasCommonData({consent})
      })
      it('should load the consent as valid, and renew it with all new vendors to consented if all vendors were consented', async () => {
        const givenCookie = COOKIE.OLDEST_GVL_ALL_ACCEPTED
        const borosTcf = initBoros({givenCookie})

        const consent = await borosTcf.loadUserConsent()
        const {valid, isNew} = consent

        expect(valid).to.be.true
        expect(isNew).to.be.false

        validateConsentHasCommonData({consent})
        await validateConsentAllLastVendorsTo({
          consent,
          consentsTo: true,
          legitimateInterestsTo: true
        })
        await validateCookieIsRenewedWithLoadedConsent({
          consent
        })
      })
      it('should load the consent as valid, and renew it with all new vendors to rejected if all vendors were rejected', async () => {
        const givenCookie = COOKIE.OLDEST_GVL_ALL_REJECTED
        const borosTcf = initBoros({givenCookie})

        const consent = await borosTcf.loadUserConsent()
        const {valid, isNew} = consent

        expect(valid).to.be.true
        expect(isNew).to.be.false

        validateConsentHasCommonData({consent})
        await validateConsentAllLastVendorsTo({
          consent,
          consentsTo: false,
          legitimateInterestsTo: false
        })
        await validateCookieIsRenewedWithLoadedConsent({
          consent
        })
      })
      it('should load the consent as valid, and renew it with all new vendors consents to rejected and legitimate interests to consented if all vendors had that status', async () => {
        const givenCookie = COOKIE.OLDEST_GVL_VENDOR_CONSENTS_REJECTED
        const borosTcf = initBoros({givenCookie})

        const consent = await borosTcf.loadUserConsent()
        const {valid, isNew} = consent

        expect(valid).to.be.true
        expect(isNew).to.be.false

        validateConsentHasCommonData({consent})
        await validateConsentAllLastVendorsTo({
          consent,
          consentsTo: false,
          legitimateInterestsTo: true
        })
        await validateCookieIsRenewedWithLoadedConsent({
          consent
        })
      })
      it('should load the consent as invalid if vendor consents were edited by the user and they does not have all the same consent', async () => {
        const givenCookie = COOKIE.OLDEST_GVL_VENDOR_CONSENTS_EDITED
        const borosTcf = initBoros({givenCookie})

        const consent = await borosTcf.loadUserConsent()
        const {valid, isNew} = consent

        expect(valid).to.be.false
        expect(isNew).to.be.false

        validateConsentHasCommonData({consent})
      })
      it('should load the consent as invalid if vendor legitimate interests were edited by the user and they does not have all the same consent', async () => {
        const givenCookie = COOKIE.OLDEST_GVL_VENDOR_LEGITIMATE_INTERESTS_EDITED
        const borosTcf = initBoros({givenCookie})

        const consent = await borosTcf.loadUserConsent()
        const {valid, isNew} = consent

        expect(valid).to.be.false
        expect(isNew).to.be.false

        validateConsentHasCommonData({consent})
      })
    })

    describe('given no exsiting cookie', () => {
      it('should load an empty consent returned as new', async () => {
        const borosTcf = initBoros()
        const consent = await borosTcf.loadUserConsent()
        expect(consent.valid).to.be.false
        expect(consent.isNew).to.be.true
        validateConsentHasCommonData({consent})
      })
    })
  })
  describe('uiVisible', () => {
    let borosTcf
    let domainEventBus
    beforeEach(() => {
      domainEventBus = {
        raise: () => null
      }
      const statusMock = {
        eventStatus: Status.TCLOADED,
        cmpStatus: Status.CMPSTATUS_LOADED
      }
      const statusRepositoryMock = {
        getStatus: () => statusMock
      }
      borosTcf = TestableTcfApiInitializer.create()
        .mock(DomainEventBus, domainEventBus)
        .mock(StatusRepository, statusRepositoryMock)
        .init()
    })
    it('should raise useractioncomplete eventStatus when visible is false', () => {
      const spyDomainEventBus = sinon.spy(domainEventBus, 'raise')
      borosTcf.uiVisible({visible: false})
      const eventStatusCalls = spyDomainEventBus
        .getCalls()
        .filter(call => call.args[0].eventName === 'event_status')
      expect(eventStatusCalls.length).to.equal(1)
      const {payload} = eventStatusCalls[0].args[0]
      expect(payload.TCData.eventStatus).to.be.equal(Status.USERACTIONCOMPLETE)
    })
    it('should raise cmpuishown Event when visible is true', () => {
      const spyDomainEventBus = sinon.spy(domainEventBus, 'raise')
      borosTcf.uiVisible({visible: true})
      const eventStatusCalls = spyDomainEventBus
        .getCalls()
        .filter(call => call.args[0].eventName === 'event_status')
      expect(eventStatusCalls.length).to.equal(1)
      const {payload} = eventStatusCalls[0].args[0]
      expect(payload.TCData.eventStatus).equal(Status.CMPUISHOWN)
    })
  })
  describe('initialization', () => {
    it('should accept a reporter to collect domain events', async () => {
      const reported = []
      const reporter = (event, payload) => reported.push({event, payload})

      const borosTcf = TestableTcfApiInitializer.create().init({reporter})

      borosTcf.getTCData({})
      await waitCondition({condition: () => reported.length > 0})
    })
  })
})
