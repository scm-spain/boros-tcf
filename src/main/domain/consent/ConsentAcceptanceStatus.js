export class ConsentAcceptanceStatus {
  constructor({consent, vendorList}) {
    this._consent = consent
    this._vendorList = vendorList
    this._status = {
      purposeConsents: STATUS_UNKNOWN
    }
    this._initialize()
  }

  isValid() {
    if (
      !this._consent.scope?.options?.onRejectionResurfaceAfterDays ||
      this._status[NODE_PURPOSE_CONSENTS] === STATUS_ALL_TRUE
    ) {
      return true
    }
    const now = Date.now()
    const revalidationMillis =
      DAY_IN_MILLIS * this._consent.scope.options.onRejectionResurfaceAfterDays
    return this._consent.lastUpdated + revalidationMillis <= now
  }

  _initialize() {
    Object.keys(this._vendorList.purposes).forEach(id => {
      const accepted = this._purposeConsentStatus({id})
      this._update({node: NODE_PURPOSE_CONSENTS, accepted})
    })
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

  _purposeConsentStatus({id}) {
    return (
      (this._consent.purpose.consents.hasOwnProperty(id) &&
        this._consent.purpose.consents[id]) ||
      false
    )
  }
}

const DAY_IN_MILLIS = 86400000

const STATUS_UNKNOWN = 0
const STATUS_ALL_TRUE = 1
const STATUS_ALL_FALSE = 2
const STATUS_MIXED = 3 // has true and false consents

const NODE_PURPOSE_CONSENTS = 'purposeConsents'
