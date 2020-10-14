import 'jsdom-global/register'
import {expect} from 'chai'
import {TCString} from '@iabtcf/core'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {
  VendorList45,
  VendorList46,
  VendorListValueEnglish,
  VendorListValueSpanish
} from '../fixtures/vendorlist/VendorListValue'
import {TestableCookieStorageMock} from '../testable/infrastructure/repository/TestableCookieStorageMock'
import {
  BOROS_TCF_ID,
  BOROS_TCF_VERSION,
  PUBLISHER_CC
} from '../../main/core/constants'
import {GVLFactory} from '../../main/infrastructure/repository/iab/GVLFactory'
import {TestableGVLFactory} from '../testable/infrastructure/repository/iab/TestableGVLFactory'
import {DomainEventBus} from '../../main/domain/service/DomainEventBus'
import sinon from 'sinon'
import {VendorListRepository} from '../../main/domain/vendorlist/VendorListRepository'
import {IABConsentDecoderService} from '../../main/infrastructure/service/IABConsentDecoderService'

import {Status} from '../../main/domain/status/Status'
import {StatusRepository} from '../../main/domain/status/StatusRepository'
import {waitCondition} from '../../main/core/service/waitCondition'

describe('BorosTcf', () => {
  beforeEach(() => {
    window.__tcfapi_boros = undefined
  })
  describe('getVendorList use case', () => {
    const initBoros = ({language} = {}) =>
      TestableTcfApiInitializer.create()
        .mock(GVLFactory, new TestableGVLFactory({language}))
        .init({language})

    it('should return the spanish latest vendor list if nothing (language, version) is specified', async () => {
      const borosTcf = initBoros()
      const vendorList = await borosTcf.getVendorList()
      expect(vendorList.vendorListVersion).to.deep.equal(
        VendorListValueSpanish.data.vendorListVersion
      )
      expect(vendorList.purposes[1]).to.deep.equal(
        VendorListValueSpanish.data.purposes[1]
      )
      expect(vendorList.features[1]).to.deep.equal(
        VendorListValueSpanish.data.features[1]
      )
      expect(vendorList.specialPurposes[1]).to.deep.equal(
        VendorListValueSpanish.data.specialPurposes[1]
      )
    })

    it('should return the translation of a specific version if parameters are specified', async () => {
      const givenVersion = VendorListValueEnglish.data.vendorListVersion
      const borosTcf = initBoros({language: 'en'})
      const vendorList = await borosTcf.getVendorList({
        version: givenVersion,
        language: 'en'
      })
      expect(vendorList.purposes[1]).to.deep.equal(
        VendorListValueEnglish.data.purposes[1]
      )
      expect(vendorList.features[1]).to.deep.equal(
        VendorListValueEnglish.data.features[1]
      )
      expect(vendorList.specialPurposes[1]).to.deep.equal(
        VendorListValueEnglish.data.specialPurposes[1]
      )
    })
  })
  describe('saveUserConsent', () => {
    const iabConsentDecoderService = new IABConsentDecoderService()
    const givenPurpose = {
      consents: {},
      legitimateInterests: {}
    }
    const givenVendor = {
      consents: {
        '1': false,
        '2': true
      },
      legitimateInterests: {
        '1': false,
        '2': true
      }
    }
    const cookie45WithoutVendorsConsentsAndIsValid =
      'CO2r3W7O2r3W7CBAEAENAtCoAP_AAH_AAAiQAAAAAAAA.YAAAAAAAAAAA'

    it('should generate and save correctly the user consent', () => {
      const mockGVLFactory = new TestableGVLFactory()
      mockGVLFactory.reset()
      mockGVLFactory.mockReply({
        path: '/LATEST?language=es',
        data: VendorList46.data
      })

      const LATEST_VENDOR_LIST_VERSION = 46

      mockGVLFactory.mockReply({
        path: '/45?language=es',
        data: VendorList45.data
      })

      const cookieStorageMock = new TestableCookieStorageMock()
      cookieStorageMock.save(
        'euconsent-v2',
        cookie45WithoutVendorsConsentsAndIsValid
      )
      const borosTcf = TestableTcfApiInitializer.create()
        .mock('euconsentCookieStorage', cookieStorageMock)
        .mock(GVLFactory, mockGVLFactory)
        .init()

      return borosTcf
        .saveUserConsent({purpose: givenPurpose, vendor: givenVendor})
        .then(() => {
          const savedConsent = cookieStorageMock.load()
          expect(savedConsent).to.be.a('string')

          const userConsent = TCString.decode(savedConsent)
          expect(userConsent.cmpId).to.equal(BOROS_TCF_ID)
          expect(userConsent.cmpVersion).to.equal(BOROS_TCF_VERSION)
          expect(userConsent.publisherCountryCode).to.equal(PUBLISHER_CC)
          expect(userConsent.vendorListVersion).to.equal(
            LATEST_VENDOR_LIST_VERSION
          )
          expect(userConsent.vendorConsents.has(2)).to.be.true
          expect(userConsent.vendorLegitimateInterests.has(2)).to.be.true
          expect(userConsent.vendorConsents.has(1)).to.be.false
          expect(userConsent.vendorLegitimateInterests.has(1)).to.be.false
        })
    })
    it('should generate and save new user consent with latest vendorlist version', () => {
      const cookieStorageMock = new TestableCookieStorageMock()
      const LATEST_VENDOR_LIST_VERSION = 46
      cookieStorageMock.storage.set(
        'euconsent-v2',
        cookie45WithoutVendorsConsentsAndIsValid
      )

      const mockGVLFactory = new TestableGVLFactory()
      mockGVLFactory.resetCaches()
      mockGVLFactory.reset()
      mockGVLFactory.mockReply({
        path: '/LATEST?language=es',
        data: VendorList46.data
      })

      mockGVLFactory.mockReply({
        path: '/45?language=es',
        data: VendorList45.data
      })

      const borosTcfVersion = TestableTcfApiInitializer.create()
        .mock('euconsentCookieStorage', cookieStorageMock)
        .mock(GVLFactory, mockGVLFactory)
        .init()

      return borosTcfVersion
        .saveUserConsent({purpose: givenPurpose, vendor: givenVendor})
        .then(() => {
          const savedConsent = cookieStorageMock.storage.get('euconsent-v2')
          expect(savedConsent).to.be.a('string')

          const userConsent = TCString.decode(savedConsent)
          expect(userConsent.cmpId).to.equal(BOROS_TCF_ID)
          expect(userConsent.cmpVersion).to.equal(BOROS_TCF_VERSION)
          expect(userConsent.publisherCountryCode).to.equal(PUBLISHER_CC)
          expect(userConsent.vendorListVersion).to.equal(
            LATEST_VENDOR_LIST_VERSION
          )
        })
    })
    it('should generate and save correctly the new user consent when an old one exists', () => {
      /* This test is not representing a real case. When the getVendorListUseCase is refactored
      this test should have a saved user consent with an old VendorList and then save a modified
      user consent with the latest vendorList version.
       */
      const givenPurpose2 = {
        consents: {
          '1': false,
          '2': true
        },
        legitimateInterests: {
          '1': false,
          '2': true
        }
      }
      const givenVendor2 = {
        consents: {
          '1': true,
          '2': true
        },
        legitimateInterests: {
          '1': true,
          '2': true
        }
      }

      const cookieStorageMock = new TestableCookieStorageMock()
      const borosTcf = TestableTcfApiInitializer.create()
        .mock('euconsentCookieStorage', cookieStorageMock)
        .init()

      return borosTcf
        .saveUserConsent({purpose: givenPurpose, vendor: givenVendor})
        .then(() =>
          borosTcf
            .saveUserConsent({
              purpose: givenPurpose2,
              vendor: givenVendor2
            })
            .then(() => {
              const savedConsent = cookieStorageMock.load()
              expect(savedConsent).to.be.a('string')

              const userConsent = iabConsentDecoderService.decode({
                encodedConsent: savedConsent
              })

              expect(userConsent.vendor.consents['1']).to.be.true
              expect(userConsent.vendor.consents['2']).to.be.true
              expect(userConsent.vendor.legitimateInterests['1']).to.be.true
              expect(userConsent.vendor.legitimateInterests['2']).to.be.true
              expect(userConsent.purpose.consents['1']).to.be.false
              expect(userConsent.purpose.consents['2']).to.be.true
              expect(userConsent.purpose.legitimateInterests['1']).to.be.false
              expect(userConsent.purpose.legitimateInterests['2']).to.be.true
            })
        )
    })
  })
  describe('loadUserConsent', () => {
    const givenPurpose = {
      consents: {},
      legitimateInterests: {}
    }
    const givenVendor = {
      consents: {
        '1': false,
        '2': true
      },
      legitimateInterests: {
        '1': false,
        '2': true
      }
    }
    const givenAllPurposesAcceptance = {
      1: true,
      2: true,
      3: true,
      4: true,
      5: true,
      6: true,
      7: true,
      8: true,
      9: true,
      10: true
    }
    const givenAllPurposesAccepted = {
      consents: {...givenAllPurposesAcceptance},
      legitimateInterests: {...givenAllPurposesAcceptance}
    }

    it('should load the saved user consent', () => {
      const borosTcf = TestableTcfApiInitializer.create()
        .mock('euconsentCookieStorage', new TestableCookieStorageMock())
        .init()
      return borosTcf
        .saveUserConsent({purpose: givenPurpose, vendor: givenVendor})
        .then(() => {
          return borosTcf.loadUserConsent()
        })
        .then(consentModel => {
          expect(consentModel.vendor).to.deep.equal(givenVendor)
          expect(consentModel.purpose).to.deep.equal(givenPurpose)
          expect(consentModel.valid).to.be.true
          expect(consentModel.isNew).to.be.false
        })
    })
    it('should load an empty consent if there was not saved user consent and is consent should be not valid', async () => {
      const borosTcf = TestableTcfApiInitializer.create().init()
      const consentModel = await borosTcf.loadUserConsent()
      expect(consentModel).to.not.be.undefined
      expect(consentModel.valid).to.be.false
      expect(consentModel.isNew).to.be.true
    })
    it('should return valid and save new consent(all accepted), when user had consent for all partners (new partners are automatically accepted)', async () => {
      const givenOldConsentWithAllVendorsAccepted = {
        consents: {
          1: true,
          2: true
        },
        legitimateInterests: {
          1: true,
          2: true
        }
      }
      const givenNewVendorListWithNewVendor = {
        policyVersion: 2,
        value: {
          vendors: {
            1: {},
            2: {},
            3: {}
          }
        }
      }
      const vendorListRepositoryMock = {
        getVendorList: () => givenNewVendorListWithNewVendor
      }

      const borosTcfMocked = TestableTcfApiInitializer.create()
        .mock('euconsentCookieStorage', new TestableCookieStorageMock())
        .mock(VendorListRepository, vendorListRepositoryMock)
        .init()

      await borosTcfMocked.saveUserConsent({
        purpose: givenAllPurposesAccepted,
        vendor: givenOldConsentWithAllVendorsAccepted,
        specialFeatures: {}
      })

      const consentModel = await borosTcfMocked.loadUserConsent()
      expect(consentModel.valid).to.be.true
      expect(consentModel.isNew).to.be.false
      expect(consentModel.vendor.consents[1]).to.be.true
      expect(consentModel.vendor.legitimateInterests[1]).to.be.true
      expect(consentModel.vendor.consents[2]).to.be.true
      expect(consentModel.vendor.legitimateInterests[2]).to.be.true
      expect(consentModel.vendor.consents[3]).to.be.true
      expect(consentModel.vendor.legitimateInterests[3]).to.be.true
    })
    it('should return valid and save a new consent(all denied), when user had denied for all partners (new partners are automatically denied)', async () => {
      const givenVendorAllDenied = {
        consents: {
          1: false,
          2: false
        },
        legitimateInterests: {
          1: false,
          2: false
        }
      }
      const givenVendorList = {
        policyVersion: 2,
        value: {
          vendors: {
            1: {},
            2: {},
            3: {}
          }
        }
      }
      const vendorListRepository = {
        getVendorList: () => givenVendorList
      }

      const borosTcf = TestableTcfApiInitializer.create()
        .mock('euconsentCookieStorage', new TestableCookieStorageMock())
        .mock(VendorListRepository, vendorListRepository)
        .init()

      await borosTcf.saveUserConsent({
        purpose: givenAllPurposesAccepted,
        vendor: givenVendorAllDenied
      })
      const consentModel = await borosTcf.loadUserConsent()
      expect(consentModel.valid).to.be.true
      expect(consentModel.isNew).to.be.false
      expect(consentModel.vendor.consents).to.be.deep.equal({})
      expect(consentModel.vendor.legitimateInterests).to.be.deep.equal({})
    })
    it('should return no valid and a new consent is merged and new vendors are set to false,  when  user had fine-granularity (the UI should be shown)', async () => {
      const givenVendorWithFineGranularity = {
        consents: {
          1: false,
          2: true
        },
        legitimateInterests: {
          1: false,
          2: false
        }
      }
      const givenVendorList = {
        policyVersion: 2,
        value: {
          vendors: {
            1: {},
            2: {},
            3: {}
          }
        }
      }
      const vendorListRepository = {
        getVendorList: () => givenVendorList
      }

      const borosTcf = TestableTcfApiInitializer.create()
        .mock('euconsentCookieStorage', new TestableCookieStorageMock())
        .mock(VendorListRepository, vendorListRepository)
        .init()

      await borosTcf.saveUserConsent({
        purpose: givenAllPurposesAccepted,
        vendor: givenVendorWithFineGranularity
      })
      const consentModel = await borosTcf.loadUserConsent()
      expect(consentModel.valid).to.be.false
      expect(consentModel.isNew).to.be.false
      expect(consentModel.vendor.consents[1]).to.be.false
      expect(consentModel.vendor.legitimateInterests[1]).to.be.false
      expect(consentModel.vendor.consents[2]).to.be.true
      expect(consentModel.vendor.legitimateInterests[2]).to.be.false
      expect(consentModel.vendor.consents[3]).to.be.false
      expect(consentModel.vendor.legitimateInterests[3]).to.be.false
    })
    it('should return valid if vendor list version are the same', async () => {
      const givenVendorList = {
        policyVersion: 2,
        version: 36,
        noMattersIfThereIsNoVendorObject: {}
      }
      const vendorListRepository = {
        getVendorList: () => givenVendorList
      }

      const mockGVLFactory = new TestableGVLFactory()
      mockGVLFactory.resetCaches()
      mockGVLFactory.reset()
      mockGVLFactory.mockReply({
        path: '/LATEST?language=es',
        data: VendorListValueEnglish.data
      })

      const cookieStorageMock = new TestableCookieStorageMock()
      const cookieVersion36 =
        'CO1wTaiO1wTaiCBADAENAkCAAAAAAAAAAAAAABEAAiAA.IF7NX2T5OI2vjq2ZdF7BEaYwfZxyigMgShhQIsS8NwIeFbBoGP2AgHBG4JCQAGBAkkACBAQIsHGBcCQABgIgRiRCMQEmMjzNKBJJAggkbM0FACDVmnsHS3ZCY70--u__bMAA'
      cookieStorageMock.save({
        data: cookieVersion36
      })
      const borosTcf = TestableTcfApiInitializer.create()
        .mock('euconsentCookieStorage', cookieStorageMock)
        .mock(GVLFactory, mockGVLFactory)
        .mock(VendorListRepository, vendorListRepository)
        .init()

      await borosTcf.saveUserConsent({
        purpose: givenPurpose,
        vendor: givenVendor
      })
      const consent = await borosTcf.loadUserConsent()
      expect(consent.valid).to.be.true
    })
    it('should return no valid consent if tcfPolicyVersion version are different and return a new empty consent', async () => {
      const givenVendorList = {
        policyVersion: 3,
        version: 36,
        noMattersIfThereIsNoVendorObject: {}
      }
      const vendorListRepository = {
        getVendorList: () => givenVendorList
      }

      const cookieStorageMock = new TestableCookieStorageMock()
      cookieStorageMock.save({
        data:
          'CO1wTaiO1wTaiCBADAENAkCAAAAAAAAAAAAAABEAAiAA.IF7NX2T5OI2vjq2ZdF7BEaYwfZxyigMgShhQIsS8NwIeFbBoGP2AgHBG4JCQAGBAkkACBAQIsHGBcCQABgIgRiRCMQEmMjzNKBJJAggkbM0FACDVmnsHS3ZCY70--u__bMAA'
      })
      const borosTcf = TestableTcfApiInitializer.create()
        .mock('euconsentCookieStorage', cookieStorageMock)
        .mock(VendorListRepository, vendorListRepository)
        .init()

      await borosTcf.saveUserConsent({
        purpose: givenPurpose,
        vendor: givenVendor
      })

      const consent = await borosTcf.loadUserConsent()
      expect(consent.valid).to.be.false
      expect(consent.isNew).to.be.true
      expect(consent.vendor.consents).to.be.deep.equal({})
      expect(consent.vendor.legitimateInterests).to.be.deep.equal({})
      expect(consent.purpose.consents).to.be.deep.equal({})
      expect(consent.purpose.legitimateInterests).to.be.deep.equal({})
    })
    it('should return valid consent if vendor list version  have changed and user have accepted previously all the vendors, and some vendors does not exist in new vendor list', async () => {
      const cookieStorageMock = new TestableCookieStorageMock()
      const cookieVersion45WithAllVendorsAccepted =
        'CO2r3W7O2r3W7CBAEAENAtCoAP_AAH_AAAiQGGNX_T5fb2vj-3Z99_tkaYwf95y3p-wzhheMs-8NyYeH7BoGP2MwvBX4JiQKGRgksjKBAQdtHGhcSQgBgIhViTKMYk2MjzNKJLJAilsbe0NYCD9mnsHT3ZCY70-vu__7P3ffwMMav-ny-3tfH9uz77_bI0xg_7zlvT9hnDC8ZZ94bkw8P2DQMfsZheCvwTEgUMjBJZGUCAg7aONC4khADARCrEmUYxJsZHmaUSWSBFLY29oawEH7NPYOnuyEx3p9fd__2fu-_gAA.YAAAAAAAAAAA'
      cookieStorageMock.save({
        data: cookieVersion45WithAllVendorsAccepted
      })

      const mockGVLFactory = new TestableGVLFactory()
      mockGVLFactory.reset()
      mockGVLFactory.mockReply({
        path: '/LATEST?language=es',
        data: VendorList46.data
      })
      mockGVLFactory.mockReply({
        path: '/45?language=es',
        data: VendorList45.data
      })
      const borosTcf = TestableTcfApiInitializer.create()
        .mock('euconsentCookieStorage', cookieStorageMock)
        .mock(GVLFactory, mockGVLFactory)
        .init()

      const consent = await borosTcf.loadUserConsent()
      expect(consent.valid).to.be.true
      expect(consent.isNew).to.be.false
    })

    it('should return empty consent if decoding old consent fails with an error', async () => {
      const throwableCookieStorage = {
        load: () => {
          throw new Error('Error loading cookie')
        }
      }
      const borosTcf = TestableTcfApiInitializer.create()
        .mock('euconsentCookieStorage', throwableCookieStorage)
        .init()

      const consent = await borosTcf.loadUserConsent()
      expect(consent.isNew).to.be.true
      expect(consent.cmpId).to.equal(BOROS_TCF_ID)
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
      const mockGVLFactory = new TestableGVLFactory()
      mockGVLFactory.reset()
      mockGVLFactory.mockReply({
        path: '/LATEST?language=es',
        data: VendorList46.data
      })

      const reporter = {
        reported: [],
        notify: (event, payload) => reporter.reported.push({event, payload})
      }

      const borosTcf = TestableTcfApiInitializer.create()
        .mock(GVLFactory, mockGVLFactory)
        .init({reporter})

      borosTcf.getTCData({})
      await waitCondition({condition: () => reporter.reported.length > 0})
    })
  })
})
