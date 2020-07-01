export class Consent {
  constructor({
    vendor,
    purpose,
    specialFeatures,
    valid = false,
    isNew = false
  }) {
    this._vendor = vendor
    this._purpose = purpose
    this._specialFeatures = specialFeatures
    this._valid = valid
    this._isNew = isNew
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

  get isNew() {
    return this._isNew
  }

  get valid() {
    return this._valid
  }

  toJSON() {
    return {
      vendor: this._vendor,
      purpose: this._purpose,
      specialFeatures: this._specialFeatures,
      valid: this._valid,
      isNew: this._isNew
    }
  }
}
