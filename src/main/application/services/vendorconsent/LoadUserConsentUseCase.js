import {inject} from '../../../core/ioc/ioc'
import {ConsentRepository} from '../../../domain/consent/ConsentRepository'
import {ConsentDecoderService} from '../../../domain/consent/ConsentDecoderService'

class LoadUserConsentUseCase {
  constructor({
    consentRepository = inject(ConsentRepository),
    consentDecoderService = inject(ConsentDecoderService)
  } = {}) {
    this._consentRepository = consentRepository
    this._consentDecoderService = consentDecoderService
  }

  execute() {
    const encodedConsent = this._consentRepository.loadUserConsent()
    if (!encodedConsent) {
      // TODO
      return null
    }
    const consent = this._consentDecoderService.decode({encodedConsent})
    return consent
  }
}

export {LoadUserConsentUseCase}
