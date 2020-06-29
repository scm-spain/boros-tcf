class VendorList {
  constructor({version, policyVersion, language, value}) {
    this._version = version
    this._policyVersion = policyVersion
    this._language = language
    this._value = value
  }

  get version() {
    return this._version
  }

  get language() {
    return this._language
  }

  get policyVersion() {
    return this._policyVersion
  }

  get value() {
    return this._value
  }
}

export {VendorList}
