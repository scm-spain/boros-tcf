import {ConsentDecoderService} from '../../domain/consent/ConsentDecoderService'
import {ConsentFactory} from '../../domain/consent/ConsentFactory'
import {TCString} from '@iabtcf/core'
import {inject} from '../../core/ioc/ioc'

class IABConsentDecoderService extends ConsentDecoderService {
  constructor({consentFactory = inject(ConsentFactory)} = {}) {
    super()
    this._consentFactory = consentFactory
  }

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

    return this._consentFactory.createConsent({
      vendor: model.vendor,
      purpose: model.purpose,
      specialFeatures: model.specialFeatures
    })
  }
}

export {IABConsentDecoderService}
