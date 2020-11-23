import {IABConsentEncoderService} from '../../../../main/infrastructure/service/IABConsentEncoderService'
import {IABConsentDecoderService} from '../../../../main/infrastructure/service/IABConsentDecoderService'
import {IABVendorListRepository} from '../../../../main/infrastructure/repository/iab/IABVendorListRepository'

const decoder = new IABConsentDecoderService()

/* istanbul ignore next */
export const iabGenerateConsent = async ({
  gvlFactory,
  allPurposeConsents = true,
  allPurposeLegitimateInterests = true,
  allSpecialFeatures = true,
  allVendorConsents = true,
  allVendorLegitimateInterests = true,
  editedVendorConsents = false,
  editedVendorLegitimateInterests = false,
  scope = {
    purposes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    specialFeatures: [1, 2]
  }
} = {}) => {
  const vendorListRepository = new IABVendorListRepository({gvlFactory})
  const vendorList = await vendorListRepository.getVendorList()
  const decodedConsent = {
    purpose: {
      consents: {},
      legitimateInterests: {}
    },
    specialFeatures: {},
    vendor: {
      consents: {},
      legitimateInterests: {}
    }
  }
  Object.keys(vendorList.purposes).forEach(purpose => {
    decodedConsent.purpose.consents[purpose] =
      (scope.purposes.includes(parseInt(purpose)) && allPurposeConsents) ||
      false
    decodedConsent.purpose.legitimateInterests[purpose] =
      (scope.purposes.includes(parseInt(purpose)) &&
        allPurposeLegitimateInterests) ||
      false
  })
  Object.keys(vendorList.specialFeatures).forEach(specialFeature => {
    decodedConsent.specialFeatures[specialFeature] =
      (scope.specialFeatures.includes(parseInt(specialFeature)) &&
        allSpecialFeatures) ||
      false
  })
  let vendorsCount = 0
  let vendorsWithPurposes = 0
  let vendorsWithLegitimateInterests = 0
  Object.keys(vendorList.vendors).forEach((vendor, index) => {
    vendorsCount++
    if (vendorList.vendors[vendor].purposes.length > 0) {
      vendorsWithPurposes++
    }
    if (vendorList.vendors[vendor].legIntPurposes.length > 0) {
      vendorsWithLegitimateInterests++
    }
    decodedConsent.vendor.consents[vendor] = editedVendorConsents
      ? index % 2 === 0
      : allVendorConsents
    decodedConsent.vendor.legitimateInterests[
      vendor
    ] = editedVendorLegitimateInterests
      ? index % 2 === 0
      : allVendorLegitimateInterests
  })
  const encodedConsent = await iabEncodeConsent({
    decodedConsent,
    gvlFactory
  })
  return {
    vendorListVersion: vendorList.vendorListVersion,
    vendorsCount,
    vendorsWithPurposes,
    vendorsWithLegitimateInterests,
    decodedConsent,
    encodedConsent
  }
}

export const iabDecodeConsent = ({encodedConsent}) => {
  return decoder.decode({encodedConsent})
}

export const iabEncodeConsent = async ({decodedConsent, gvlFactory}) => {
  const encoder = new IABConsentEncoderService({gvlFactory})
  return encoder.encode({
    consent: decodedConsent,
    vendorListVersion: decodedConsent.vendorListVersion
  })
}
