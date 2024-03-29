import {GVL} from '@iabtcf/core'
import {
  VENDOR_LIST_DEFAULT_LANGUAGE,
  VENDOR_LIST_ENDPOINT,
  VENDOR_LIST_LATEST_VERSION
} from '../../../core/constants'
import {Language} from '../../../domain/vendorlist/Language'

export class GVLFactory {
  constructor({
    baseUrl = VENDOR_LIST_ENDPOINT,
    language = VENDOR_LIST_DEFAULT_LANGUAGE
  } = {}) {
    GVL.baseUrl = baseUrl
    this._language = new Language(language).value
    this._cached = new Map()
  }

  create({version = VENDOR_LIST_LATEST_VERSION} = {}) {
    const key = this._key({version})
    if (!this._cached.has(key)) {
      this._setStaticGVLParameters()
      this._cached.set(key, new GVL(version))
    }
    return this._cached.get(key)
  }

  _key({version}) {
    return `${version}:${this._language}`
  }

  resetCaches() {
    GVL.emptyCache()
    GVL.emptyLanguageCache()
    this._cached = new Map()
  }

  _setStaticGVLParameters() {
    GVL.languageFilename = `${VENDOR_LIST_LATEST_VERSION}/[LANG]`
    GVL.latestFilename = `${VENDOR_LIST_LATEST_VERSION}/${this._language}`
    GVL.versionedFilename = `[VERSION]/${this._language}`
  }
}
