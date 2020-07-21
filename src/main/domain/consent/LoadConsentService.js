import {inject} from '../../core/ioc/ioc'
import {ConsentRepository} from '../consent/ConsentRepository'
import {ConsentFactory} from '../consent/ConsentFactory'
import {ConsentDecoderService} from '../consent/ConsentDecoderService'
import {VendorListRepository} from '../vendorlist/VendorListRepository'
import {ConsentEncoderService} from './ConsentEncoderService'
import {VendorListHelper} from '../vendorlist/VendorListHelper'
import {Version} from '../vendorlist/Version'

export class LoadConsentService {
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

    if (newVendorList.policyVersion !== existingConsent.policyVersion) {
      return this._consentFactory.createEmptyConsent()
    }

    const result = await this._isValidAndSaveNewConsent({
      newVendorList,
      consent: existingConsent
    })

    return result
      ? this._createValidConsentWithTheSavedOne()
      : this._createAnInValidConsentAndMergeListVendors({
          existingConsent,
          newVendorList
        })
  }

  _createAnInValidConsentAndMergeListVendors({existingConsent, newVendorList}) {
    existingConsent.valid = false
    existingConsent.vendor = this._vendorListHelper.mergeVendors({
      newVendorList: newVendorList.value.vendors,
      oldVendors: existingConsent.vendor
    })
    return this._consentFactory.createConsent(existingConsent)
  }

  async _createValidConsentWithTheSavedOne() {
    const validEncodedConsent = await this._consentRepository.loadUserConsent()
    const validConsent = this._consentDecoderService.decode({
      encodedConsent: validEncodedConsent
    })

    validConsent.valid = true
    return this._consentFactory.createConsent(validConsent)
  }

  async _isValidAndSaveNewConsent({newVendorList, consent}) {
    if (newVendorList.version === consent.vendorListVersion) {
      return true
    }

    const oldVendorList = await this._vendorListRepository.getVendorList({
      version: new Version(consent.vendorListVersion)
    })

    return (
      (await this._consentHaveConsentsAndLIForAllVendorsWithTheSameValue({
        consent,
        newVendorList,
        value: true,
        oldVendorList: oldVendorList.value.vendors
      })) ||
      this._consentHaveConsentsAndLIForAllVendorsWithTheSameValue({
        consent,
        newVendorList,
        value: false,
        oldVendorList: oldVendorList.value.vendors
      })
    )
  }

  async _consentHaveConsentsAndLIForAllVendorsWithTheSameValue({
    consent,
    newVendorList,
    value,
    oldVendorList
  }) {
    let isValid = false
    if (
      this._vendorListHelper.haveAllValuesTo({
        object: consent.vendor.consents,
        valueToVerify: value,
        oldVendorList
      }) &&
      this._vendorListHelper.haveAllValuesTo({
        object: consent.vendor.legitimateInterests,
        valueToVerify: value,
        oldVendorList
      })
    ) {
      consent.vendor = this._vendorListHelper.setAllVendorsTo({
        vendorList: newVendorList.value.vendors,
        valueToSet: value
      })

      const encodedConsent = await this._consentEncoderService.encode({consent})
      this._consentRepository.saveUserConsent({
        consent: encodedConsent
      })

      isValid = true
    }
    return isValid
  }
}
