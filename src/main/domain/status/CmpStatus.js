import {inject} from '../../core/ioc/ioc'
import {ConsentRepository} from '../consent/ConsentRepository'
import {ConsentDecoderService} from '../consent/ConsentDecoderService'

export class CmpStatus {
  /**
   * cmpStatus: CMP not yet loaded – stub still in place
   */
  static STUB = 'stub'

  /**
   * cmpStatus: CMP is loading
   */
  static LOADING = 'loading'

  /**
   * cmpStatus: CMP is finished loading
   */
  static LOADED = 'loaded'

  /**
   * cmpStatus: CMP is in an error state.
   * A CMP shall not respond to any other API requests if this cmpStatus is present.
   * A CMP may set this status if, for any reason, it is unable to perform the operations
   * in compliance with the TCF.
   */
  static ERROR = 'error'

  /**
   *
   * @param {Object} param
   * @param {ConsentRepository} param.consentRepository
   * @param {ConsentDecoderService} param.consentDecoderService
   */
  constructor({
    consentRepository = inject(ConsentRepository),
    consentDecoderService = inject(ConsentDecoderService)
  } = {}) {
    this._consentRepository = consentRepository
    this._consentDecoderService = consentDecoderService
  }

  /**
   * @readonly
   * @memberof CmpStatus
   * @returns {Boolean}
   */
  get loaded() {
    return true
  }

  /**
   * @readonly
   * @memberof CmpStatus
   * @returns {String}
   */
  get code() {
    return CmpStatus.LOADED
  }

  /**
   * Returns gvlVersion. undefined if no consent
   *
   * @readonly
   * @memberof CmpStatus
   * @returns {Number | undefined}
   */
  get gvlVersion() {
    const encodedConsent = this._consentRepository.loadUserConsent()
    if (!encodedConsent) {
      return undefined
    }
    const decodedConsent = this._consentDecoderService.decode({encodedConsent})
    return decodedConsent.vendorListVersion
  }
}
