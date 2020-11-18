import {inject} from '../../core/ioc/ioc'
import {ConsentRepository} from '../consent/ConsentRepository'
import {ConsentFactory} from '../consent/ConsentFactory'
import {ConsentDecoderService} from '../consent/ConsentDecoderService'
import {VendorListRepository} from '../vendorlist/VendorListRepository'
import {ConsentEncoderService} from './ConsentEncoderService'
import {Version} from '../vendorlist/Version'

export class LoadConsentService {
  constructor({
    consentRepository = inject(ConsentRepository),
    consentFactory = inject(ConsentFactory),
    consentDecoderService = inject(ConsentDecoderService),
    consentEncoderService = inject(ConsentEncoderService),
    vendorListRepository = inject(VendorListRepository)
  } = {}) {
    this._consentRepository = consentRepository
    this._consentFactory = consentFactory
    this._consentDecoderService = consentDecoderService
    this._consentEncoderService = consentEncoderService
    this._vendorListRepository = vendorListRepository
  }

  async loadConsent() {
    const encodedConsent = this._consentRepository.loadUserConsent()
    if (!encodedConsent) {
      return this._consentFactory.createEmptyConsent()
    }
    const decodedConsent = this._consentDecoderService.decode({encodedConsent})
    const newVendorList = await this._vendorListRepository.getVendorList()

    if (newVendorList.policyVersion !== decodedConsent.policyVersion) {
      return this._consentFactory.createEmptyConsent()
    }

    let consent
    if (newVendorList.version === decodedConsent.vendorListVersion) {
      consent = this._consentFactory.createConsent(decodedConsent)
      consent.checkValidity({consentVendorList: newVendorList})
    } else {
      consent = this._consentFactory.createConsent(decodedConsent)
      const oldVendorList = await this._vendorListRepository.getVendorList({
        version: new Version(consent.vendorListVersion)
      })
      consent.checkValidity({
        consentVendorList: oldVendorList,
        newVendorList
      })
    }

    if (consent.valid) {
      const encodedConsent = await this._consentEncoderService.encode({
        consent,
        vendorListVersion: consent.vendorListVersion
      })
      this._consentRepository.saveUserConsent({
        encodedConsent: encodedConsent,
        decodedConsent: consent
      })
    }

    return consent
  }
}
