import {GVL} from '@iabtcf/core'

export class GVLFactory {
  constructor({
    baseUrl = 'https://a.dcdn.es/borostcf/v2/vendorlist',
    language = 'en'
  } = {}) {
    GVL.baseUrl = baseUrl
    this._setStaticGVLParameters({language})
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

  async _changeLanguage({language, gvl}) {
    if (language && language !== gvl.language) {
      this._setStaticGVLParameters({language})
      const changeLanguage = gvl.changeLanguage(language)
      await changeLanguage
    }
  }

  _setStaticGVLParameters({language}) {
    GVL.latestFilename = `LATEST?language=${language}`
    GVL.versionedFilename = `[VERSION]?language=${language}`
  }

  resetCaches() {
    GVL.emptyCache()
    GVL.emptyLanguageCache()
  }
}
