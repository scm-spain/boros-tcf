import {GVL} from '@iabtcf/core'
import {
  VENDOR_LIST_DEFAULT_LANGUAGE,
  VENDOR_LIST_LATEST_VERSION
} from '../../../core/constants'

export class GVLFactory {
  constructor({
    baseUrl = 'https://a.dcdn.es/borostcf/v2/vendorlist',
    language = VENDOR_LIST_DEFAULT_LANGUAGE
  } = {}) {
    GVL.baseUrl = baseUrl
    GVL.latestFilename = `${VENDOR_LIST_LATEST_VERSION}?language=${language}`
    GVL.versionedFilename = `[VERSION]?language=${language}`
    this._cached = new Map()
  }

  create({version = VENDOR_LIST_LATEST_VERSION} = {}) {
    if (!this._cached.has(version)) {
      this._cached.set(version, new GVL(version))
    }
    return this._cached.get(version)
  }
}
