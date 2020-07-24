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

    const result = await this._isValid({
      newVendorList,
      consent: existingConsent
    })

    return result
      ? this._createValidConsentWithTheSavedOne({savedConsent: existingConsent})
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

  async _createValidConsentWithTheSavedOne({savedConsent}) {
    const consent = await this._renewSavedConsent({savedConsent})
    consent.valid = true
    return this._consentFactory.createConsent(consent)
  }

  async _renewSavedConsent({savedConsent}) {
    const encodedConsent = await this._consentEncoderService.encode({
      consent: savedConsent
    })
    this._consentRepository.saveUserConsent({
      consent: encodedConsent
    })
    const renewedEncodedConsent = this._consentRepository.loadUserConsent()
    const consent = this._consentDecoderService.decode({
      encodedConsent: renewedEncodedConsent
    })
    return consent
  }

  async _isValid({newVendorList, consent}) {
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
      isValid = true
    }
    return isValid
  }
}
