import {LoadConsentService} from '../../../main/domain/consent/LoadConsentService'
import {expect} from 'chai'
import {Consent} from '../../../main/domain/consent/Consent'
import {IABConsentDecoderService} from '../../../main/infrastructure/service/IABConsentDecoderService'
import {VendorList} from '../../../main/domain/vendorlist/VendorList'
import {IABConsentEncoderService} from '../../../main/infrastructure/service/IABConsentEncoderService'
import {GVLFactory} from '../../../main/infrastructure/repository/iab/GVLFactory'

describe('LoadConsentService Should', () => {
  describe('when the consent not exists', () => {
    const anEmptyConsent = new Consent({
      vendor: {},
      purpose: {},
      specialFeatures: {},
      valid: false
    })

    const consentRepositoryThatReturnsNull = {loadUserConsent: () => null}
    const consentFactory = {createEmptyConsent: () => anEmptyConsent}
    const consentDecoderService = {}
    const consentEncoderService = {}
    const vendorListRepository = {}
    it('Should create empty consent if cookie does not exist', async () => {
      const loadConsentService = new LoadConsentService({
        consentRepository: consentRepositoryThatReturnsNull,
        consentFactory,
        consentDecoderService,
        consentEncoderService,
        vendorListRepository
      })
      const consent = await loadConsentService.loadConsent()
      expect(consent).exist
      expect(consent).to.be.deep.equal(anEmptyConsent)
    })
  })
  describe('when the consent exists and all vendors are accepted purposes', () => {
    const encodedConsent =
      'CO1hOaZO1hOaZCBABAENArCAAMAAAEAAAAAAABMAAmAA.IGCNV_T5eb2vj-3Zdt_tkaYwf55y3o-wzhhaIse8NwIeH7BoGP2MwvBX4JiQCGBAkkiKBAQdtHGhcCQABgIhRiTKMYk2MjzNKJLJAilsbO0NYCD9mnsHT3ZCY70--u__7P3fAAAA'
    const consentRepositoryThatReturnsAValidConsent = {
      loadUserConsent: () => encodedConsent,
      saveUserConsent: () => null
    }

    const decodedConsent = new IABConsentDecoderService().decode({
      encodedConsent
    })
    const aValidConsent = {
      valid: true,
      ...decodedConsent
    }

    const consentFactory = {
      createConsent: () => aValidConsent
    }
    const consentDecoderService = new IABConsentDecoderService()
    const consentEncoderService = new IABConsentEncoderService({
      gvlFactory: new GVLFactory()
    })

    it('when retrieved vendor list have the same version we return valid consent and a copy of existing consent', async () => {
      const vendorList = new VendorList({
        version: 43,
        policyVersion: 2,
        value: {}
      })
      const vendorListRepositoryWithTheSameVersion = {
        getVendorList: () => vendorList
      }
      const loadConsentService = new LoadConsentService({
        consentRepository: consentRepositoryThatReturnsAValidConsent,
        consentFactory,
        consentDecoderService,
        consentEncoderService,
        vendorListRepository: vendorListRepositoryWithTheSameVersion
      })
      const consent = await loadConsentService.loadConsent()
      expect(consent).exist
      expect(consent.valid).to.be.true
      expect(consent.vendor).to.be.deep.equal(decodedConsent.vendor)
      expect(consent.purpose).to.be.deep.equal(decodedConsent.purpose)
    })
  })
})
