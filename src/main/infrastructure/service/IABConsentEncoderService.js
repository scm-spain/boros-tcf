import {TCModel, TCString, GVL} from '@iabtcf/core'
import {ConsentEncoderService} from '../../domain/consent/ConsentEncoderService'
import {BOROS_TCF_ID, BOROS_TCF_VERSION} from '../../core/constants'

class IABConsentEncoderService extends ConsentEncoderService {
  constructor() {
    super()
    GVL.baseUrl = 'https://a.dcdn.es/borostcf/v2/vendorlist'
    GVL.latestFilename = 'LATEST'
  }

  encode({purpose, vendor}) {
    // create a new TC string

    // TODO extract to a factory
    const tcModel = new TCModel(new GVL())
    tcModel.cmpId = BOROS_TCF_ID
    tcModel.cmpVersion = BOROS_TCF_VERSION

    // Some fields will not be populated until a GVL is loaded
    return tcModel.gvl.readyPromise.then(() => TCString.encode(tcModel))
  }
}

export {IABConsentEncoderService}
