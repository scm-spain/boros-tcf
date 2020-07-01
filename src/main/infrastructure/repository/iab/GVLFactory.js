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

  async changeLanguage({language, gvl}) {
    if (language && language !== 'en') {
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
