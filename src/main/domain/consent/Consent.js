import {
  BOROS_TCF_ID,
  BOROS_TCF_VERSION,
  PUBLISHER_CC,
  TCF_API_VERSION
} from '../../core/constants'
import {VendorAcceptanceStatus} from '../vendorlist/VendorAcceptanceStatus'

export class Consent {
  /**
   *
   * @param {Object} param
   * @param {Object} param.vendor
   * @param {Object.<Number, Boolean>} param.vendor.consents
   * @param {Object.<Number, Boolean>} param.vendor.legitimateInterests
   * @param {Object} param.purpose
   * @param {Object.<Number, Boolean>} param.purpose.consents
   * @param {Object.<Number, Boolean>} param.purpose.legitimateInterests
   * @param {Object} [param.publisher]
   * @param {Object.<Number, Boolean>} param.publisher.consents
   * @param {Object.<Number, Boolean>} param.publisher.legitimateInterests
   * @param {Object} param.publisher.customPurpose
   * @param {Object} param.publisher.restrictions
   * @param {Object.<Number, Boolean>} param.specialFeatures
   * @param {boolean} [param.valid]
   * @param {boolean} [param.isNew]
   */
  constructor({
    cmpId = BOROS_TCF_ID,
    cmpVersion = BOROS_TCF_VERSION,
    created,
    lastUpdated,
    policyVersion = TCF_API_VERSION,
    vendorListVersion,
    publisherCC = PUBLISHER_CC,
    isServiceSpecific = true,
    useNonStandardStacks = false,
    purposeOneTreatment = false,
    vendor,
    purpose,
    specialFeatures,
    publisher = {
      consents: {},
      legitimateInterests: {},
      customPurpose: {},
      restrictions: {}
    },
    valid = false,
    isNew = false
  }) {
    this._cmpId = cmpId
    this._cmpVersion = cmpVersion
    this._created = created
    this._lastUpdated = lastUpdated
    this._policyVersion = policyVersion
    this._vendorListVersion = vendorListVersion
    this._publisherCC = publisherCC
    this._isServiceSpecific = isServiceSpecific
    this._useNonStandardStacks = useNonStandardStacks
    this._purposeOneTreatment = purposeOneTreatment
    this._vendor = vendor
    this._purpose = purpose
    this._specialFeatures = specialFeatures
    this._publisher = publisher
    this._valid = valid
    this._isNew = isNew
  }

  updateVendors({oldVendorList, newVendorList}) {
    const updated = {
      consents: {},
      legitimateInterests: {}
    }
    const consentVendorsAcceptanceStatus = new VendorAcceptanceStatus({
      consent: this,
      vendorList: oldVendorList
    })
    Object.keys(newVendorList.vendors).forEach(key => {
      updated.consents[key] = consentVendorsAcceptanceStatus.resolveConsent({
        current: this._vendor.consents[key]
      })
      updated.legitimateInterests[
        key
      ] = consentVendorsAcceptanceStatus.resolveLegitimateInterest({
        current: this._vendor.legitimateInterests[key]
      })
    })
    this._vendor = updated
    this._vendorListVersion = newVendorList.version
    this._valid = consentVendorsAcceptanceStatus.isValid()
  }

  get vendor() {
    return this._vendor
  }

  get purpose() {
    return this._purpose
  }

  get publisher() {
    return this._publisher
  }

  get specialFeatures() {
    return this._specialFeatures
  }

  get isNew() {
    return this._isNew
  }

  get valid() {
    return this._valid
  }

  get cmpVersion() {
    return this._cmpVersion
  }

  get policyVersion() {
    return this._policyVersion
  }

  get vendorListVersion() {
    return this._vendorListVersion
  }

  toJSON() {
    return {
      cmpId: this._cmpId,
      cmpVersion: this._cmpVersion,
      policyVersion: this._policyVersion,
      vendorListVersion: this._vendorListVersion,
      publisherCC: this._publisherCC,
      isServiceSpecific: this._isServiceSpecific,
      useNonStandardStacks: this._useNonStandardStacks,
      purposeOneTreatment: this._purposeOneTreatment,
      vendor: {...this._vendor},
      purpose: {...this._purpose},
      specialFeatures: {...this._specialFeatures},
      publisher: {...this._publisher},
      valid: this._valid,
      isNew: this._isNew
    }
  }
}
