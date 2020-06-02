import {GVL} from '@iabtcf/core'

export class GVLFactory {
  constructor({
    baseUrl = 'https://a.dcdn.es/borostcf/v2/vendorlist',
    language = 'es'
  } = {}) {
    GVL.baseUrl = baseUrl
    GVL.latestFilename = `LATEST?language=${language}`
    GVL.versionedFilename = `[VERSION]?language=${language}`
  }

  create({version} = {}) {
    return new GVL(version)
  }
}
