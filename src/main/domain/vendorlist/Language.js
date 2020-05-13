import {InvalidLanguageValueError} from './error/InvalidLanguageValueError'
import {VENDOR_LIST_DEFAULT_LANGUAGE} from '../../core/constants'

class Language {
  constructor(languageValue) {
    this._value = this._extractValue(languageValue)
  }

  get value() {
    return this._value
  }

  _extractValue(languageValue) {
    if (!languageValue || VENDOR_LIST_DEFAULT_LANGUAGE === languageValue) {
      return VENDOR_LIST_DEFAULT_LANGUAGE
    }
    if (languageValue.toLowerCase() !== languageValue) {
      throw new InvalidLanguageValueError(languageValue)
    }
    if (languageValue.length !== 2) {
      throw new InvalidLanguageValueError(languageValue)
    }
    return languageValue
  }
}

export {Language}
