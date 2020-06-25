import {
  BOROS_TCF_ID,
  BOROS_TCF_VERSION,
  TCF_API_SUPPORTED_VERSION,
  TCF_API_VERSION
} from '../../core/constants'
class PingReturn {
  /**
   *
   * @param {Object} param
   * @param {import('./../status/Status').Status} param.status
   */
  constructor({status} = {}) {
    this._status = status
  }

  /**
   * true - GDPR Applies
   * false - GDPR Does not apply
   * undefined - unknown whether GDPR Applies
   * see the section: "What does the gdprApplies value mean?"
   */
  get gdprApplies() {
    return true
  }

  /**
   * true - CMP main script is loaded
   * false - still running stub
   * @returns {Boolean}
   */
  get cmpLoaded() {
    return this._status.loaded
  }

  /**
   * see Ping Status Codes in following table
   */
  get cmpStatus() {
    return this._status.cmpStatus
  }

  /**
   * see Ping Status Codes in following table
   */
  get displayStatus() {
    return this._status.cmpStatus
  }

  /**
   * version of the CMP API that is supported e.g. "2.0"
   */

  get apiVersion() {
    return TCF_API_SUPPORTED_VERSION
  }

  /**
   * CMPs own/internal version that is currently running
   * undefined if still the stub
   */
  get cmpVersion() {
    return BOROS_TCF_VERSION
  }

  /**
   * IAB Assigned CMP ID
   * undefined if still the stub
   */
  get cmpId() {
    return BOROS_TCF_ID
  }

  /**
   * Version of the GVL currently loaded by the CMP
   * undefined if still the stub
   */
  get gvlVersion() {
    return this._status.gvlVersion
  }

  /**
   * Number of the supported TCF version
   * undefined if still the stub
   */
  get tcfPolicyVersion() {
    return TCF_API_VERSION
  }

  value() {
    return {
      gdprApplies: this.gdprApplies,
      cmpLoaded: this.cmpLoaded,
      cmpStatus: this.cmpStatus,
      displayStatus: this.displayStatus,
      apiVersion: this.apiVersion,
      cmpVersion: this.cmpVersion,
      cmpId: this.cmpId,
      gvlVersion: this.gvlVersion,
      tcfPolicyVersion: this.tcfPolicyVersion
    }
  }
}

export {PingReturn}
