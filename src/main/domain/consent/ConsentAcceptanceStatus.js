export class ConsentAcceptanceStatus {
  constructor({consent, vendorList}) {
    this._consent = consent
    this._vendorList = vendorList
    this._status = {
      purposeConsents: STATUS_UNKNOWN,
      specialFeatures: STATUS_UNKNOWN
    }
    this._initialize()
  }

  isValid() {
    const allTrue =
      this._status[NODE_PURPOSE_CONSENTS] === STATUS_ALL_TRUE &&
      this._status[NODE_SPECIAL_FEATURES] === STATUS_ALL_TRUE
    if (
      allTrue ||
      !this._consent.scope?.options?.onRejectionResurfaceAfterDays
    ) {
      return true
    }
    const now = Date.now()
    const consentDate =
      this._consent.lastUpdated || this._consent.created || new Date()
    const timeDiffInMillis = now - consentDate.valueOf()
    const timeDiffInDays = Math.floor(timeDiffInMillis / DAY_IN_MILLIS)
    return (
      timeDiffInDays < this._consent.scope.options.onRejectionResurfaceAfterDays
    )
  }

  _initialize() {
    Object.keys(this._vendorList.purposes)
      .filter(
        id =>
          !this._consent.scope?.purposes ||
          this._consent.scope.purposes.indexOf(parseInt(id)) > -1
      )
      .forEach(id => {
        const accepted = this._purposeConsentStatus({id})
        this._update({node: NODE_PURPOSE_CONSENTS, accepted})
      })
    Object.keys(this._vendorList.specialFeatures)
      .filter(
        id =>
          !this._consent.scope?.specialFeatures ||
          this._consent.scope.specialFeatures.indexOf(parseInt(id)) > -1
      )
      .forEach(id => {
        const accepted = this._specialFeatureStatus({id})
        this._update({node: NODE_SPECIAL_FEATURES, accepted})
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

  _specialFeatureStatus({id}) {
    return (
      (this._consent.specialFeatures.hasOwnProperty(id) &&
        this._consent.specialFeatures[id]) ||
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
const NODE_SPECIAL_FEATURES = 'specialFeatures'
