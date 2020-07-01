import 'jsdom-global/register'
import {expect} from 'chai'
import {TCString} from '@iabtcf/core'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {
  VendorListValueEnglish,
  VendorListValueSpanish
} from '../fixtures/vendorlist/VendorListValue'
import {TestableCookieStorageMock} from '../testable/infrastructure/repository/TestableCookieStorageMock'
import {CookieStorage} from '../../main/infrastructure/repository/cookie/CookieStorage'
import {BOROS_TCF_ID} from '../../main/core/constants'
import {GVLFactory} from '../../main/infrastructure/repository/iab/GVLFactory'
import {TestableGVLFactory} from '../testable/infrastructure/repository/iab/TestableGVLFactory'
import {DomainEventBus} from '../../main/domain/service/DomainEventBus'
import sinon from 'sinon'
import {VendorListRepository} from '../../main/domain/vendorlist/VendorListRepository'
import {IABConsentDecoderService} from '../../main/infrastructure/service/IABConsentDecoderService'

import {Status} from '../../main/domain/status/Status'
import {StatusRepository} from '../../main/domain/status/StatusRepository'

describe('BorosTcf', () => {
  describe('getVendorList use case', () => {
    let borosTcf
    beforeEach(() => {
      borosTcf = TestableTcfApiInitializer.create()
        .mock(GVLFactory, new TestableGVLFactory())
        .init()
    })

    it('should return the spanish latest vendor list if nothing (language, version) is specified', async () => {
      const vendorList = await borosTcf.getVendorList()
      expect(vendorList.vendorListVersion).to.deep.equal(
        VendorListValueSpanish.data.vendorListVersion
      )
      expect(vendorList.purposes[1]).to.deep.equal(
        VendorListValueSpanish.data.purposes[1]
      )
    })

    it('should return the translation of a specific version if parameters are specified', async () => {
      const givenVersion = VendorListValueEnglish.data.vendorListVersion
      const vendorList = await borosTcf.getVendorList({
        version: givenVersion,
        language: 'en'
      })
      expect(vendorList.purposes[1]).to.deep.equal(
        VendorListValueEnglish.data.purposes[1]
      )
    })
  })
  describe('saveUserConsent', () => {
    const iabConsentDecoderService = new IABConsentDecoderService()
    let borosTcf
    let cookieStorageMock
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
    beforeEach(() => {
      cookieStorageMock = new TestableCookieStorageMock()
      borosTcf = TestableTcfApiInitializer.create()
        .mock(CookieStorage, cookieStorageMock)
        .init()
    })

    it('should generate and save correctly the user consent', () => {
      return borosTcf
        .saveUserConsent({purpose: givenPurpose, vendor: givenVendor})
        .then(() => {
          const savedConsent = cookieStorageMock.storage.get('euconsent-v2')
          expect(savedConsent).to.be.a('string')

          const userConsent = TCString.decode(savedConsent)

          expect(userConsent.cmpId).to.equal(BOROS_TCF_ID)
          expect(userConsent.vendorConsents.has(2)).to.be.true
          expect(userConsent.vendorLegitimateInterests.has(2)).to.be.true
          expect(userConsent.vendorConsents.has(1)).to.be.false
          expect(userConsent.vendorLegitimateInterests.has(1)).to.be.false
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

      return borosTcf
        .saveUserConsent({purpose: givenPurpose, vendor: givenVendor})
        .then(() =>
          borosTcf
            .saveUserConsent({
              purpose: givenPurpose2,
              vendor: givenVendor2
            })
            .then(() => {
              const savedConsent = cookieStorageMock.storage.get('euconsent-v2')
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
    let borosTcf
    let cookieStorageMock
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
    const givenAcceptedAllPurpose = {
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
    beforeEach(() => {
      cookieStorageMock = new TestableCookieStorageMock()
      borosTcf = TestableTcfApiInitializer.create()
        .mock(CookieStorage, cookieStorageMock)
        .init()
    })

    it('should load the saved user consent', () => {
      const borosTcf = TestableTcfApiInitializer.create()
        .mock(CookieStorage, cookieStorageMock)
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
      const consentModel = await borosTcf.loadUserConsent()
      expect(consentModel).to.not.be.undefined
      expect(consentModel.valid).to.be.false
      expect(consentModel.isNew).to.be.true
    })
    it('should return valid  and save new consent(all accepted), when user had consent for all partners (new partners are automatically accepted)', async () => {
      const givenVendorAllAccepted = {
        consents: {
          1: true,
          2: true
        },
        legitimateInterests: {
          1: true,
          2: true
        }
      }
      const givenVendorList = {
        policyVersion: 2,
        vendors: {
          1: {},
          2: {},
          3: {}
        }
      }
      const vendorListRepository = {
        getVendorList: () => givenVendorList
      }

      const borosTcfMocked = TestableTcfApiInitializer.create()
        .mock(CookieStorage, cookieStorageMock)
        .mock(VendorListRepository, vendorListRepository)
        .init()

      await borosTcfMocked.saveUserConsent({
        purpose: givenAcceptedAllPurpose,
        vendor: givenVendorAllAccepted
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
        vendors: {
          1: {},
          2: {},
          3: {}
        }
      }
      const vendorListRepository = {
        getVendorList: () => givenVendorList
      }

      const borosTcf = TestableTcfApiInitializer.create()
        .mock(CookieStorage, cookieStorageMock)
        .mock(VendorListRepository, vendorListRepository)
        .init()

      await borosTcf.saveUserConsent({
        purpose: givenAcceptedAllPurpose,
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
        vendors: {
          1: {},
          2: {},
          3: {}
        }
      }
      const vendorListRepository = {
        getVendorList: () => givenVendorList
      }

      const borosTcf = TestableTcfApiInitializer.create()
        .mock(CookieStorage, cookieStorageMock)
        .mock(VendorListRepository, vendorListRepository)
        .init()

      await borosTcf.saveUserConsent({
        purpose: givenAcceptedAllPurpose,
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

      cookieStorageMock.save({
        data:
          'CO1wTaiO1wTaiCBADAENAkCAAAAAAAAAAAAAABEAAiAA.IF7NX2T5OI2vjq2ZdF7BEaYwfZxyigMgShhQIsS8NwIeFbBoGP2AgHBG4JCQAGBAkkACBAQIsHGBcCQABgIgRiRCMQEmMjzNKBJJAggkbM0FACDVmnsHS3ZCY70--u__bMAA'
      })
      const borosTcf = TestableTcfApiInitializer.create()
        .mock(CookieStorage, cookieStorageMock)
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

      cookieStorageMock.save({
        data:
          'CO1wTaiO1wTaiCBADAENAkCAAAAAAAAAAAAAABEAAiAA.IF7NX2T5OI2vjq2ZdF7BEaYwfZxyigMgShhQIsS8NwIeFbBoGP2AgHBG4JCQAGBAkkACBAQIsHGBcCQABgIgRiRCMQEmMjzNKBJJAggkbM0FACDVmnsHS3ZCY70--u__bMAA'
      })
      const borosTcf = TestableTcfApiInitializer.create()
        .mock(CookieStorage, cookieStorageMock)
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
  })
  describe('uiVisible', () => {
    let borosTcf
    let domainEventBus
    beforeEach(() => {
      domainEventBus = new DomainEventBus()
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
      expect(spyDomainEventBus.calledOnce).to.be.true
      const {payload} = spyDomainEventBus.firstCall.args[0]
      expect(payload.TCData.eventStatus).to.be.equal(Status.USERACTIONCOMPLETE)
    })
    it('should raise cmpuishown Event when visible is true', () => {
      const spyDomainEventBus = sinon.spy(domainEventBus, 'raise')
      borosTcf.uiVisible({visible: true})
      expect(spyDomainEventBus.calledOnce).to.be.true
      const {payload} = spyDomainEventBus.firstCall.args[0]
      expect(payload.TCData.eventStatus).equal(Status.CMPUISHOWN)
    })
  })
})
