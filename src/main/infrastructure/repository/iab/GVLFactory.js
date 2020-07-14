import {GVL} from '@iabtcf/core'
import {
  VENDOR_LIST_DEFAULT_LANGUAGE,
  VENDOR_LIST_LATEST_VERSION
} from '../../../core/constants'

export class GVLFactory {
  constructor({baseUrl = 'https://a.dcdn.es/borostcf/v2/vendorlist'} = {}) {
    GVL.baseUrl = baseUrl
    this._cached = new Map()
  }

  create({
    version = VENDOR_LIST_LATEST_VERSION,
    language = VENDOR_LIST_DEFAULT_LANGUAGE
  } = {}) {
    const key = this._key({version, language})
    if (!this._cached.has(key)) {
      this._setStaticGVLParameters({language})
      this._cached.set(key, new GVL(version))
    }
    return this._cached.get(key)
  }

  _key({version, language}) {
    return `${version}:${language}`
  }

  resetCaches() {
    GVL.emptyCache()
    GVL.emptyLanguageCache()
  }

  _setStaticGVLParameters({language}) {
    GVL.languageFilename = `${VENDOR_LIST_LATEST_VERSION}?language=[LANG]`
    GVL.latestFilename = `${VENDOR_LIST_LATEST_VERSION}?language=${language}`
    GVL.versionedFilename = `[VERSION]?language=${language}`
  }
}
