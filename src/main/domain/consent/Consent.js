export class Consent {
  constructor({encodedValue, vendor, purpose, specialFeatures}) {
    this._encodedValue = encodedValue
    this._vendor = vendor
    this._purpose = purpose
    this._specialFeatures = specialFeatures
  }

  get encodedValue() {
    return this._encodedValue
  }

  get vendor() {
    return this._vendor
  }

  get purpose() {
    return this._purpose
  }

  get specialFeatures() {
    return this._specialFeatures
  }
}
