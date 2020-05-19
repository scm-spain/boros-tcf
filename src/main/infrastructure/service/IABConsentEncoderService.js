import {TCModel, TCString, GVL} from '@iabtcf/core'
import {ConsentEncoderService} from '../../domain/consent/ConsentEncoderService'
import {BOROS_TCF_ID, BOROS_TCF_VERSION} from '../../core/constants'

class IABConsentEncoderService extends ConsentEncoderService {
  constructor() {
    super()
    GVL.baseUrl = 'https://a.dcdn.es/borostcf/v2/vendorlist'
    GVL.latestFilename = 'LATEST'
  }

  // create a new TC string
  encode({vendor, purpose, specialFeatures}) {
    // TODO extract to a factory
    const tcModel = new TCModel(new GVL())
    tcModel.cmpId = BOROS_TCF_ID
    tcModel.cmpVersion = BOROS_TCF_VERSION

    const setIabVector = ({value = {}, vector}) =>
      Object.keys(value).forEach(k =>
        value[k] ? vector.set(parseInt(k)) : vector.unset(parseInt(k))
      )

    setIabVector({value: vendor.consents, vector: tcModel.vendorConsents})
    setIabVector({
      value: vendor.legitimateInterests,
      vector: tcModel.vendorLegitimateInterests
    })

    setIabVector({value: purpose.consents, vector: tcModel.purposeConsents})
    setIabVector({
      value: purpose.legitimateInterests,
      vector: tcModel.purposeLegitimateInterests
    })

    setIabVector({value: specialFeatures, vector: tcModel.specialFeatureOptins})

    // Some fields will not be populated until a GVL is loaded
    return tcModel.gvl.readyPromise.then(() => TCString.encode(tcModel))
  }
}

export {IABConsentEncoderService}
