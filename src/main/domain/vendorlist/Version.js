import {InvalidVersionValueError} from './error/InvalidVersionValueError'

class Version {
  constructor(versionValue) {
    this._value = this._extractValue(versionValue)
  }

  get value() {
    return this._value
  }

  _extractValue(versionValue) {
    if (!versionValue || DEFAULT_VALUE === versionValue) {
      return DEFAULT_VALUE
    }
    const numericValue = parseInt(versionValue)
    if (numericValue !== versionValue) {
      throw new InvalidVersionValueError(versionValue)
    }
    return numericValue
  }
}

const DEFAULT_VALUE = 'LATEST'

export {Version}
