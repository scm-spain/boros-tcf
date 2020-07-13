import {GVL} from '@iabtcf/core'
import {VENDOR_LIST_DEFAULT_LANGUAGE} from '../../../core/constants'

export class GVLFactory {
  constructor({baseUrl = 'https://a.dcdn.es/borostcf/v2/vendorlist'} = {}) {
    GVL.baseUrl = baseUrl
    this._setStaticGVLParameters({language: VENDOR_LIST_DEFAULT_LANGUAGE})
    GVL.languageFilename = 'LATEST?language=[LANG]'
  }

  create({version} = {}) {
    return new GVL(version)
  }

  async createWith({version, language} = {}) {
    const gvl = this.create({version})
    await this._changeLanguage({language, gvl})
    return gvl
  }

  resetCaches() {
    GVL.emptyCache()
    GVL.emptyLanguageCache()
  }

  async _changeLanguage({language, gvl}) {
    if (language && language !== gvl.language) {
      this._setStaticGVLParameters({language})
      await gvl.changeLanguage(language)
    }
  }

  _setStaticGVLParameters({language}) {
    GVL.latestFilename = `LATEST?language=${language}`
    GVL.versionedFilename = `[VERSION]?language=${language}`
  }
}
