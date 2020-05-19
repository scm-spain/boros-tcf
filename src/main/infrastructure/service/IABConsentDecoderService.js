import {ConsentDecoderService} from '../../domain/consent/ConsentDecoderService'
import {TCString} from '@iabtcf/core'

class IABConsentDecoderService extends ConsentDecoderService {
  decode({encodedConsent}) {
    const tcModel = TCString.decode(encodedConsent)

    const ourModel = {
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
      model: ourModel.vendor.consents
    })
    mapToModel({
      vector: tcModel.vendorLegitimateInterests,
      model: ourModel.vendor.legitimateInterests
    })
    mapToModel({
      vector: tcModel.purposeConsents,
      model: ourModel.purpose.consents
    })
    mapToModel({
      vector: tcModel.purposeLegitimateInterests,
      model: ourModel.purpose.legitimateInterests
    })
    mapToModel({
      vector: tcModel.specialFeatureOptins,
      model: ourModel.specialFeatures
    })

    return ourModel
  }
}

export {IABConsentDecoderService}
