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
    it('should load an empty consent if there was not saved user consent', async () => {
      const consentModel = await borosTcf.loadUserConsent()
      expect(consentModel).to.not.be.undefined
      expect(consentModel.valid).to.be.false
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
