import {TestableGVLFactory} from '../repository/iab/TestableGVLFactory'
import {IABConsentEncoderService} from '../../../../main/infrastructure/service/IABConsentEncoderService'
import {IABConsentDecoderService} from '../../../../main/infrastructure/service/IABConsentDecoderService'

const decoder = new IABConsentDecoderService()

export const iabEncodeConsent = async ({
  latestVersion,
  acceptance = true
} = {}) => {
  const gvlFactory = new TestableGVLFactory({
    latestVersion
  })
  const gvl = gvlFactory.create()
  await gvl.readyPromise
  const consent = {
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
    consent.purpose.consents[purpose] = acceptance
    consent.purpose.legitimateInterests[purpose] = acceptance
  })
  Object.keys(gvl.specialFeatures).forEach(specialFeature => {
    consent.specialFeatures[specialFeature] = acceptance
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
    consent.vendor.consents[vendor] = acceptance
    consent.vendor.legitimateInterests[vendor] = acceptance
  })
  const encoder = new IABConsentEncoderService({gvlFactory})
  const encodedConsent = await encoder.encode({consent})
  return {
    vendorListVersion: gvl.vendorListVersion,
    vendorsCount,
    vendorsWithPurposes,
    vendorsWithLegitimateInterests,
    encodedConsent
  }
}

export const iabDecodeConsent = ({encodedConsent}) => {
  return decoder.decode({encodedConsent})
}
