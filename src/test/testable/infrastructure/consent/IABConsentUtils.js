import {TestableGVLFactory} from '../repository/iab/TestableGVLFactory'
import {IABConsentEncoderService} from '../../../../main/infrastructure/service/IABConsentEncoderService'
import {IABConsentDecoderService} from '../../../../main/infrastructure/service/IABConsentDecoderService'

const decoder = new IABConsentDecoderService()

export const iabGenerateConsent = async ({
  latestGvlVersion,
  acceptance = true
} = {}) => {
  const gvlFactory = new TestableGVLFactory({
    latestGvlVersion
  })
  const gvl = gvlFactory.create()
  await gvl.readyPromise
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
  Object.keys(gvl.purposes).forEach(purpose => {
    decodedConsent.purpose.consents[purpose] = acceptance
    decodedConsent.purpose.legitimateInterests[purpose] = acceptance
  })
  Object.keys(gvl.specialFeatures).forEach(specialFeature => {
    decodedConsent.specialFeatures[specialFeature] = acceptance
  })
  let vendorsCount = 0
  let vendorsWithPurposes = 0
  let vendorsWithLegitimateInterests = 0
  Object.keys(gvl.vendors).forEach(vendor => {
    vendorsCount++
    if (gvl.vendors[vendor].purposes.length > 0) {
      vendorsWithPurposes++
    }
    if (gvl.vendors[vendor].legIntPurposes.length > 0) {
      vendorsWithLegitimateInterests++
    }
    decodedConsent.vendor.consents[vendor] = acceptance
    decodedConsent.vendor.legitimateInterests[vendor] = acceptance
  })
  const encoder = new IABConsentEncoderService({gvlFactory})
  const encodedConsent = await encoder.encode({consent: decodedConsent})
  return {
    vendorListVersion: gvl.vendorListVersion,
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
