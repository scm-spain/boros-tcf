export class VendorAcceptanceStatus {
  constructor({consent, vendorList}) {
    this._consent = consent
    this._vendorList = vendorList
    this._status = {
      consents: STATUS_UNKNOWN,
      legitimateInterests: STATUS_UNKNOWN
    }
    this._initialize()
  }

  resolveConsent({current}) {
    return this._resolve({node: NODE_CONSENTS, current})
  }

  resolveLegitimateInterest({current}) {
    return this._resolve({node: NODE_LEGITIMATE_INTERESTS, current})
  }

  isValid() {
    return (
      this._isSetToAll({node: NODE_CONSENTS}) &&
      this._isSetToAll({node: NODE_LEGITIMATE_INTERESTS})
    )
  }

  _initialize() {
    this._vendorList.vendorsWithPurposes().forEach(id => {
      const accepted = this._vendorNodeStatus({
        id,
        node: NODE_CONSENTS
      })
      this._update({node: NODE_CONSENTS, accepted})
    })
    this._vendorList.vendorsWithLegitimateInterests().forEach(id => {
      const accepted = this._vendorNodeStatus({
        id,
        node: NODE_LEGITIMATE_INTERESTS
      })
      this._update({node: NODE_LEGITIMATE_INTERESTS, accepted})
    })
  }

  _isSetToAll({node}) {
    return (
      this._status[node] === STATUS_ALL_TRUE ||
      this._status[node] === STATUS_ALL_FALSE
    )
  }

  _resolve({node, current = false}) {
    switch (this._status[node]) {
      case STATUS_ALL_TRUE:
        return true
      case STATUS_ALL_FALSE:
        return false
      default:
        return current
    }
  }

  _update({node, accepted}) {
    if (this._status[node] === STATUS_UNKNOWN) {
      this._status[node] =
        accepted === true ? STATUS_ALL_TRUE : STATUS_ALL_FALSE
    } else if (
      (this._status[node] === STATUS_ALL_TRUE && accepted === false) ||
      (this._status[node] === STATUS_ALL_FALSE && accepted === true)
    ) {
      this._status[node] = STATUS_MIXED
    }
  }

  _vendorNodeStatus({id, node}) {
    return (
      (this._consent.vendor[node].hasOwnProperty(id) &&
        this._consent.vendor[node][id]) ||
      false
    )
  }
}

const STATUS_UNKNOWN = 0
const STATUS_ALL_TRUE = 1
const STATUS_ALL_FALSE = 2
const STATUS_MIXED = 3 // has true and false consents

const NODE_CONSENTS = 'consents'
const NODE_LEGITIMATE_INTERESTS = 'legitimateInterests'
