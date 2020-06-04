import {ConsentDecoderService} from '../../domain/consent/ConsentDecoderService'
import {TCString} from '@iabtcf/core'

class IABConsentDecoderService extends ConsentDecoderService {
  decode({encodedConsent}) {
    const tcModel = TCString.decode(encodedConsent)

    const model = {
      vendor: {
        consents: {},
        legitimateInterests: {}
      },
      purpose: {
        consents: {},
        legitimateInterests: {}
      },
      specialFeatures: {}
    }

    const mapToModel = ({vector, model}) =>
      vector.forEach((value, id) => {
        model[`${id}`] = value
      })

    mapToModel({
      vector: tcModel.vendorConsents,
      model: model.vendor.consents
    })
    mapToModel({
      vector: tcModel.vendorLegitimateInterests,
      model: model.vendor.legitimateInterests
    })
    mapToModel({
      vector: tcModel.purposeConsents,
      model: model.purpose.consents
    })
    mapToModel({
      vector: tcModel.purposeLegitimateInterests,
      model: model.purpose.legitimateInterests
    })
    mapToModel({
      vector: tcModel.specialFeatureOptins,
      model: model.specialFeatures
    })

    return {
      vendor: model.vendor,
      purpose: model.purpose,
      specialFeatures: model.specialFeatures
    }
  }
}

export {IABConsentDecoderService}
