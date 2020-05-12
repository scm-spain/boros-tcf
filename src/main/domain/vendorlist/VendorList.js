class VendorList {
  constructor({version, language, value}) {
    this._version = version
    this._language = language
    this._value = value
  }

  get version() {
    return this._version
  }

  get language() {
    return this._language
  }

  get value() {
    return this._value
  }
}

export {VendorList}
