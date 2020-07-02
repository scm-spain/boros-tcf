export class Consent {
  /**
   *
   * @param {Object} param
   * @param {Object} param.vendor
   * @param {Object.<Number, Boolean>} param.vendor.consents
   * @param {Object.<Number, Boolean>} param.vendor.legitimateInterests
   * @param {Object} param.purpose
   * @param {Object.<Number, Boolean>} param.purpose.consents
   * @param {Object.<Number, Boolean>} param.purpose.legitimateInterests
   * @param {Object} [param.publisher]
   * @param {Object.<Number, Boolean>} param.publisher.consents
   * @param {Object.<Number, Boolean>} param.publisher.legitimateInterests
   * @param {Object} param.publisher.customPurpose
   * @param {Object} param.publisher.restrictions
   * @param {Object.<Number, Boolean>} param.specialFeatures
   * @param {boolean} [param.valid]
   * @param {boolean} [param.isNew]
   */
  constructor({
    vendor,
    purpose,
    specialFeatures,
    publisher = {
      consents: {},
      legitimateInterests: {},
      customPurpose: {},
      restrictions: {}
    },
    valid = false,
    isNew = false
  }) {
    this._vendor = vendor
    this._purpose = purpose
    this._specialFeatures = specialFeatures
    this._publisher = publisher
    this._valid = valid
    this._isNew = isNew
  }

  

  get vendor() {
    return this._vendor
  }

  get purpose() {
    return this._purpose
  }

  get publisher() {
    return this._publisher
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
      vendor: {...this._vendor},
      purpose: {...this._purpose},
      specialFeatures: {...this._specialFeatures},
      publisher: {...this._publisher},
      valid: this._valid,
      isNew: this._isNew
    }
  }
}
