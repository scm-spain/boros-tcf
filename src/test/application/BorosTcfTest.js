import 'jsdom-global/register'
import {expect} from 'chai'
import {TCString} from '@iabtcf/core'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {VendorListValue} from '../fixtures/vendorlist/VendorListValue'
import {TestableCookieStorageMock} from '../testable/infrastructure/repository/TestableCookieStorageMock'
import {CookieStorage} from '../../main/infrastructure/repository/cookie/CookieStorage'
import {BOROS_TCF_ID} from '../../main/core/constants'
import {GVLFactory} from '../../main/infrastructure/repository/iab/GVLFactory'
import {TestableGVLFactory} from '../testable/infrastructure/repository/iab/TestableGVLFactory'
import {DomainEventBus} from '../../main/domain/service/DomainEventBus'
import sinon from 'sinon'
import {EventStatus} from '../../main/domain/status/EventStatus'
import {VendorListRepository} from '../../main/domain/vendorlist/VendorListRepository'

describe('BorosTcf', () => {
  describe('getVendorList use case', () => {
    let borosTcf
    beforeEach(() => {
      borosTcf = TestableTcfApiInitializer.create()
        .mock(GVLFactory, new TestableGVLFactory())
        .init()
    })

    it('should return the untranslated latest vendor list if nothing is specified', async () => {
      const vendorList = await borosTcf.getVendorList()
      expect(vendorList).to.deep.equal(VendorListValue.data)
    })

    it('should return the translation of a specific version if parameters are specified', async () => {
      const givenVersion = VendorListValue.data.vendorListVersion
      const vendorList = await borosTcf.getVendorList({
        version: givenVersion
      })
      expect(vendorList).to.deep.equal(VendorListValue.data)
    })
  })
  describe('saveUserConsent', () => {
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
        .then(() => {
          return borosTcf.saveUserConsent({
            purpose: givenPurpose2,
            vendor: givenVendor2
          })
        })
        .then(() => {
          const savedConsent = cookieStorageMock.storage.get('euconsent-v2')
          expect(savedConsent).to.be.a('string')

          const userConsent = TCString.decode(savedConsent)
          expect(userConsent.cmpId).to.equal(BOROS_TCF_ID)
          expect(userConsent.vendorConsents.has(1)).to.be.true
          expect(userConsent.vendorConsents.has(2)).to.be.true
          expect(userConsent.vendorLegitimateInterests.has(1)).to.be.true
          expect(userConsent.vendorLegitimateInterests.has(2)).to.be.true
          expect(userConsent.purposeConsents.has(1)).to.be.false
          expect(userConsent.purposeConsents.has(2)).to.be.true
          expect(userConsent.purposeLegitimateInterests.has(1)).to.be.false
          expect(userConsent.purposeLegitimateInterests.has(2)).to.be.true
        })
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
        })
    })
    it('should load an empty consent if there was not saved user consent and is consent should be not valid', async () => {
      const consentModel = await borosTcf.loadUserConsent()
      expect(consentModel).to.not.be.undefined
      expect(consentModel.valid).to.be.false
    })
    it('should return valid  and save new consent, when user had consent for all partners (new partners are automatically accepted)', async () => {
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
      // save consent wit consent for all vendors
      await borosTcf.saveUserConsent({
        purpose: givenAcceptedAllPurpose,
        vendor: givenVendorAllAccepted
      })
      const consentModel = await borosTcf.loadUserConsent()
      expect(consentModel.valid).to.be.true
      expect(consentModel.vendor.consents[1]).to.be.true
      expect(consentModel.vendor.legitimateInterests[1]).to.be.true
      expect(consentModel.vendor.consents[2]).to.be.true
      expect(consentModel.vendor.legitimateInterests[2]).to.be.true
      expect(consentModel.vendor.consents[3]).to.be.true
      expect(consentModel.vendor.legitimateInterests[3]).to.be.true
    })
    it('should return valid and save new consent, when user had denied for all partners (new partners are automatically denied)', async () => {
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
      // save consent wit consent for all vendors
      await borosTcf.saveUserConsent({
        purpose: givenAcceptedAllPurpose,
        vendor: givenVendorAllDenied
      })
      const consentModel = await borosTcf.loadUserConsent()
      expect(consentModel.valid).to.be.true
      expect(consentModel.vendor.consents).to.be.deep.equal({})
      expect(consentModel.vendor.legitimateInterests).to.be.deep.equal({})
    })
    it('should return no valid and NOT  new consent is merged and new venders are set to true,  when  user had fine-granularity (the UI should be shown)', async () => {
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
      const givenVendorAllDenied = {
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
      // save consent wit consent for all vendors
      await borosTcf.saveUserConsent({
        purpose: givenAcceptedAllPurpose,
        vendor: givenVendorAllDenied
      })
      const consentModel = await borosTcf.loadUserConsent()
      expect(consentModel.valid).to.be.false
      expect(consentModel.vendor.consents[1]).to.be.false
      expect(consentModel.vendor.legitimateInterests[1]).to.be.false
      expect(consentModel.vendor.consents[2]).to.be.true
      expect(consentModel.vendor.legitimateInterests[2]).to.be.false
      expect(consentModel.vendor.consents[3]).to.be.false
      expect(consentModel.vendor.legitimateInterests[3]).to.be.false
    })
    it('should return valid if vendor list version are the same', async () => {
      const givenVendorList = {
        version: 36,
        noMattersIfThereIsNoVendorObject: {}
      }
      const vendorListRepository = {
        getVendorList: () => givenVendorList
      }

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
  })
  describe('uiVisible', () => {
    let borosTcf
    let domainEventBus
    beforeEach(() => {
      domainEventBus = new DomainEventBus()
      borosTcf = TestableTcfApiInitializer.create()
        .mock(DomainEventBus, domainEventBus)
        .init()
    })
    it('should raise useractioncomplete eventStatus when visible is false', () => {
      const spyDomainEventBus = sinon.spy(domainEventBus, 'raise')
      borosTcf.uiVisible({visible: false})

      expect(spyDomainEventBus.calledOnce).to.be.true
      expect(
        spyDomainEventBus.getCall(0).args[0].payload.TCData.eventStatus
      ).to.deep.equal(EventStatus.USERACTIONCOMPLETE)
    })
    it('should raise cmpuishown Event when visible is true', () => {
      const spyDomainEventBus = sinon.spy(domainEventBus, 'raise')
      borosTcf.uiVisible({visible: true})
      expect(spyDomainEventBus.calledOnce).to.be.true
      expect(
        spyDomainEventBus.getCall(0).args[0].payload.TCData.eventStatus
      ).equal(EventStatus.CMPUISHOWN)
    })
  })
})
