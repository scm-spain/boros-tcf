import {TCModel, TCString} from '@iabtcf/core'
import {ConsentEncoderService} from '../../domain/consent/ConsentEncoderService'
import {BOROS_TCF_ID, BOROS_TCF_VERSION} from '../../core/constants'
import {inject} from '../../core/ioc/ioc'
import {GVLFactory} from '../repository/iab/GVLFactory'

class IABConsentEncoderService extends ConsentEncoderService {
  constructor({gvlFactory = inject(GVLFactory)} = {}) {
    super()
    this._gvlFactory = gvlFactory
  }

  encode({consent = {}, previousEncodedConsent} = {}) {
    const {vendor = {}, purpose = {}, specialFeatures = {}} = consent
    const latestGVL = this._gvlFactory.create()
    const tcModel = previousEncodedConsent
      ? TCString.decode(previousEncodedConsent)
      : new TCModel(latestGVL)
    tcModel.cmpId = BOROS_TCF_ID
    tcModel.cmpVersion = BOROS_TCF_VERSION
    tcModel.gvl = latestGVL

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
