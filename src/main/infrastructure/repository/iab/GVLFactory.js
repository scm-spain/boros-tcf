import {GVL} from '@iabtcf/core'
import {VENDOR_LIST_DEFAULT_LANGUAGE} from '../../../core/constants'

export class GVLFactory {
  constructor({
    baseUrl = 'https://a.dcdn.es/borostcf/v2/vendorlist',
    language = VENDOR_LIST_DEFAULT_LANGUAGE
  } = {}) {
    GVL.baseUrl = baseUrl
    GVL.latestFilename = `LATEST?language=${language}`
    GVL.versionedFilename = `[VERSION]?language=${language}`
  }

  create({version = 'LATEST'} = {}) {
    return new GVL(version)
  }
}
