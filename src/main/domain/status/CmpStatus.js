import {inject} from '../../core/ioc/ioc'
import {ConsentRepository} from '../consent/ConsentRepository'
import {ConsentDecoderService} from '../consent/ConsentDecoderService'

export class CmpStatus {
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

  get gvlVersion() {
    const encodedConsent = this._consentRepository.loadUserConsent()
    if (!encodedConsent) {
      return undefined
    }
    const decodedConsent = this._consentDecoderService.decode({encodedConsent})
    return decodedConsent.vendorListVersion
  }
}
