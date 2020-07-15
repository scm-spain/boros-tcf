import {ConsentDecoderService} from '../../domain/consent/ConsentDecoderService'
import {TCString} from '@iabtcf/core'

class IABConsentDecoderService extends ConsentDecoderService {
  /**
   *
   * @param {Object} param
   * @param {String} param.encodedConsent
   */
  decode({encodedConsent}) {
    const mapToModel = vector => {
      const {maxId = 0} = vector
      const model = {}
      for (let i = 1; i <= maxId; i++) {
        model[i] = vector.has(i)
      }
      return model
    }

    const tcModel = TCString.decode(encodedConsent)
    const model = {
      tcfPolicyVersion: tcModel.policyVersion,
      cmpId: tcModel.cmpId,
      cmpVersion: tcModel.cmpVersion,
      isServiceSpecific: tcModel.isServiceSpecific,
      useNonStandardStacks: tcModel.useNonStandardStacks,
      publisherCC: tcModel.publisherCountryCode,
      vendorListVersion: tcModel.vendorListVersion,
      policyVersion: tcModel.policyVersion,
      purposeOneTreatment: tcModel.purposeOneTreatment,
      vendor: {
        consents: mapToModel(tcModel.vendorConsents),
        legitimateInterests: mapToModel(tcModel.vendorLegitimateInterests)
      },
      purpose: {
        consents: mapToModel(tcModel.purposeConsents),
        legitimateInterests: mapToModel(tcModel.purposeLegitimateInterests)
      },
      specialFeatures: mapToModel(tcModel.specialFeatureOptins),
      publisher: {
        consents: mapToModel(tcModel.publisherConsents),
        customPurpose: {
          consents: mapToModel(tcModel.publisherCustomConsents),
          legitimateInterests: mapToModel(
            tcModel.publisherCustomLegitimateInterests
          )
        },
        legitimateInterests: mapToModel(tcModel.publisherLegitimateInterests),
        restrictions: mapToModel(tcModel.publisherRestrictions)
      }
    }

    return {
      ...model
    }
  }
}

export {IABConsentDecoderService}
