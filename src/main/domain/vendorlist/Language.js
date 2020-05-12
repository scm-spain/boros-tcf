import {InvalidLanguageValueError} from './error/InvalidLanguageValueError'

class Language {
  constructor(languageValue) {
    this._value = this._extractValue(languageValue)
  }

  get value() {
    return this._value
  }

  _extractValue(languageValue) {
    if (!languageValue || DEFAULT_LANGUAGE_VALUE === languageValue) {
      return DEFAULT_LANGUAGE_VALUE
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

const DEFAULT_LANGUAGE_VALUE = 'en'

export {Language}
