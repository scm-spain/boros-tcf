class VendorList {
  constructor({version, policyVersion, value}) {
    this._version = version
    this._policyVersion = policyVersion
    this._value = value
  }

  get version() {
    return this._version
  }

  get policyVersion() {
    return this._policyVersion
  }

  get value() {
    return this._value
  }
}

export {VendorList}
