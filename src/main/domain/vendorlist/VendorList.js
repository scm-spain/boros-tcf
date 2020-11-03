class VendorList {
  constructor({version, policyVersion, value = {}}) {
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

  get purposes() {
    return this._value.purposes
  }

  get specialFeatures() {
    return this._value.vendors
  }

  get vendors() {
    return this._value.vendors
  }

  vendorsWithPurposes() {
    return this._vendorsWithUsage({usageNode: VENDOR_NODE_PURPOSES})
  }

  vendorsWithLegitimateInterests() {
    return this._vendorsWithUsage({usageNode: VENDOR_NODE_LEGITIMATE_INTERESTS})
  }

  _vendorsWithUsage({usageNode}) {
    return Object.keys(this._value.vendors).filter(
      id =>
        this._value.vendors[id].deletedDate === undefined &&
        this._value.vendors[id][usageNode].length > 0
    )
  }
}

const VENDOR_NODE_PURPOSES = 'purposes'
const VENDOR_NODE_LEGITIMATE_INTERESTS = 'legIntPurposes'

export {VendorList}
