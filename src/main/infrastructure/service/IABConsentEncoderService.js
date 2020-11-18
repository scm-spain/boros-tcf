import {TCModel, TCString} from '@iabtcf/core'
import {ConsentEncoderService} from '../../domain/consent/ConsentEncoderService'
import {
  BOROS_TCF_ID,
  BOROS_TCF_VERSION,
  PUBLISHER_CC
} from '../../core/constants'
import {inject} from '../../core/ioc/ioc'
import {GVLFactory} from '../repository/iab/GVLFactory'

class IABConsentEncoderService extends ConsentEncoderService {
  constructor({gvlFactory = inject(GVLFactory)} = {}) {
    super()
    this._gvlFactory = gvlFactory
  }

  async encode({consent = {}, vendorListVersion} = {}) {
    const {vendor = {}, purpose = {}, specialFeatures = {}, created} = consent
    const tcModel = new TCModel(
      this._gvlFactory.create({version: vendorListVersion})
    )
    tcModel.created = created || tcModel.created
    tcModel.gdprApplies = true
    tcModel.isServiceSpecific = true
    tcModel.cmpId = BOROS_TCF_ID
    tcModel.cmpVersion = BOROS_TCF_VERSION
    tcModel.publisherCountryCode = PUBLISHER_CC

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
