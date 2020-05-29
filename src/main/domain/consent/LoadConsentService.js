import {inject} from '../../core/ioc/ioc'
import {ConsentRepository} from '../consent/ConsentRepository'
import {ConsentFactory} from '../consent/ConsentFactory'
import {ConsentDecoderService} from '../consent/ConsentDecoderService'

export class LoadConsentService {
  constructor({
    consentRepository = inject(ConsentRepository),
    consentFactory = inject(ConsentFactory),
    consentDecoderService = inject(ConsentDecoderService)
  } = {}) {
    this._consentRepository = consentRepository
    this._consentFactory = consentFactory
    this._consentDecoderService = consentDecoderService
  }

  async loadConsent() {
    const encodedConsent = this._consentRepository.loadUserConsent()
    if (!encodedConsent) {
      return this._consentFactory.createEmptyConsent()
    }
    return this._consentFactory.createConsent(
      this._consentDecoderService.decode({encodedConsent})
    )
  }
}
