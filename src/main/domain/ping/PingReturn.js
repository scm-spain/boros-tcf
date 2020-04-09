import {HIDDEN, LOADED} from './statusCodes'
import {
  BOROS_TCF_ID,
  BOROS_TCF_VERSION,
  TCF_API_SUPPORTED_VERSION,
  TCF_API_VERSION
} from '../../core/constants'

class PingReturn {
  constructor() {
    /**
     * true - GDPR Applies
     * false - GDPR Does not apply
     * undefined - unknown whether GDPR Applies
     * see the section: "What does the gdprApplies value mean?"
     */
    this._gdprApplies = undefined

    /**
     * true - CMP main script is loaded
     * false - still running stub
     */
    this._cmpLoaded = true

    /**
     * see Ping Status Codes in following table
     */
    this._cmpStatus = LOADED

    /**
     * see Ping Status Codes in following table
     */
    this._displayStatus = HIDDEN

    /**
     * version of the CMP API that is supported e.g. "2.0"
     */
    this._apiVersion = TCF_API_SUPPORTED_VERSION

    /**
     * CMPs own/internal version that is currently running
     * undefined if still the stub
     */
    this._cmpVersion = BOROS_TCF_VERSION

    /**
     * IAB Assigned CMP ID
     * undefined if still the stub
     */
    // TODO this is a constant
    this._cmpId = BOROS_TCF_ID

    /**
     * Version of the GVL currently loaded by the CMP
     * undefined if still the stub
     */
    // TODO not developed yet
    this._gvlVersion = undefined

    /**
     * Number of the supported TCF version
     * undefined if still the stub
     */
    this._tcfPolicyVersion = TCF_API_VERSION
  }

  get gdprApplies() {
    return this._gdprApplies
  }

  get cmpLoaded() {
    return this._cmpLoaded
  }

  get cmpStatus() {
    return this._cmpStatus
  }

  get displayStatus() {
    return this._displayStatus
  }

  get apiVersion() {
    return this._apiVersion
  }

  get cmpVersion() {
    return this._cmpVersion
  }

  get cmpId() {
    return this._cmpId
  }

  get gvlVersion() {
    return this._gvlVersion
  }

  get tcfPolicyVersion() {
    return this._tcfPolicyVersion
  }
}

export {PingReturn}
