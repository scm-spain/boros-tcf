export class Consent {
  constructor({vendor, purpose, specialFeatures, valid}) {
    this._vendor = vendor
    this._purpose = purpose
    this._specialFeatures = specialFeatures
    this._valid = valid
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

  toJSON() {
    return {
      vendor: this._vendor,
      purpose: this._purpose,
      specialFeatures: this._specialFeatures,
      valid: this._valid
    }
  }
}
