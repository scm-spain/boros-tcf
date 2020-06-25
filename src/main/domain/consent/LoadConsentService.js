import {inject} from '../../core/ioc/ioc'
import {ConsentRepository} from '../consent/ConsentRepository'
import {ConsentFactory} from '../consent/ConsentFactory'
import {ConsentDecoderService} from '../consent/ConsentDecoderService'
import {VendorListRepository} from '../vendorlist/VendorListRepository'
import {ConsentEncoderService} from './ConsentEncoderService'
import {VendorListHelper} from '../vendorlist/VendorListHelper'

export class LoadConsentService {
  _consentEncoderService
  _vendorListHelper
  constructor({
    consentRepository = inject(ConsentRepository),
    consentFactory = inject(ConsentFactory),
    consentDecoderService = inject(ConsentDecoderService),
    consentEncoderService = inject(ConsentEncoderService),
    vendorListRepository = inject(VendorListRepository),
    vendorListHelper = inject(VendorListHelper)
  } = {}) {
    this._consentRepository = consentRepository
    this._consentFactory = consentFactory
    this._consentDecoderService = consentDecoderService
    this._consentEncoderService = consentEncoderService
    this._vendorListRepository = vendorListRepository
    this._vendorListHelper = vendorListHelper
  }

  async loadConsent() {
    const encodedConsent = this._consentRepository.loadUserConsent()

    if (!encodedConsent) {
      return this._consentFactory.createEmptyConsent()
    }
    const existingConsent = this._consentDecoderService.decode({encodedConsent})

    const newVendorList = await this._vendorListRepository.getVendorList()

    return this._isValidAndSaveNewConsent({
      newVendorList,
      consent: existingConsent
    })
      ? this._createValidConsentWithTheSavedOne()
      : this.createAnInValidConsentAndMergeListVendors({
          existingConsent,
          newVendorList
        })
  }

  createAnInValidConsentAndMergeListVendors({existingConsent, newVendorList}) {
    existingConsent.valid = false
    existingConsent.vendor = this._vendorListHelper.mergeVendors({
      newVendorList: newVendorList.vendors,
      oldVendors: existingConsent.vendor
    })
    return this._consentFactory.createConsent(existingConsent)
  }

  async _createValidConsentWithTheSavedOne() {
    const validEncodedConsent = await this._consentRepository.loadUserConsent()
    const validConsent = await this._consentDecoderService.decode({
      encodedConsent: validEncodedConsent
    })
    validConsent.valid = true
    return this._consentFactory.createConsent(validConsent)
  }

  _isValidAndSaveNewConsent({newVendorList, consent}) {
    if (newVendorList.version === consent.vendorListVersion) {
      return true
    }

    return (
      this._consentHaveConsentsAndLIForAllVendorsWithTheSameValue({
        consent,
        newVendorList,
        value: true
      }) ||
      this._consentHaveConsentsAndLIForAllVendorsWithTheSameValue({
        consent,
        newVendorList,
        value: false
      })
    )
  }

  _consentHaveConsentsAndLIForAllVendorsWithTheSameValue({
    consent,
    newVendorList,
    value
  }) {
    let isValid = false
    if (
      this._vendorListHelper.haveAllValuesTo({
        object: consent.vendor.consents,
        valueToVerify: value
      }) &&
      this._vendorListHelper.haveAllValuesTo({
        object: consent.vendor.legitimateInterests,
        valueToVerify: value
      })
    ) {
      consent.vendor = this._vendorListHelper.setAllVendorsTo({
        vendorList: newVendorList.vendors,
        valueToSet: value
      })
      this._consentRepository.saveUserConsent({
        consent: this._consentEncoderService.encode({consent})
      })
      isValid = true
    }
    return isValid
  }
}
