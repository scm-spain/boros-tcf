import {TCModel, TCString, GVL} from '@iabtcf/core'
import {ConsentEncoderService} from '../../domain/consent/ConsentEncoderService'

class IABConsentEncoderService extends ConsentEncoderService {
  constructor() {
    super()
    GVL.baseUrl = 'https://a.dcdn.es/borostcf/v2/vendorlist'
    GVL.latestFilename = 'LATEST'
  }

  encode({purpose, vendor}) {
    // create a new TC string
    const tcModel = new TCModel(new GVL())

    // Some fields will not be populated until a GVL is loaded
    return tcModel.gvl.readyPromise.then(() => TCString.encode(tcModel))
  }
}

export {IABConsentEncoderService}
