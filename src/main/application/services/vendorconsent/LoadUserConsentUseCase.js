import {inject} from '../../../core/ioc/ioc'
import {ConsentDecoderService} from '../../../domain/consent/ConsentDecoderService'
import {LoadConsentService} from '../../../domain/consent/LoadConsentService'

class LoadUserConsentUseCase {
  constructor({
    consentDecoderService = inject(ConsentDecoderService),
    loadConsentService = inject(LoadConsentService)
  } = {}) {
    this._consentDecoderService = consentDecoderService
    this._loadConsentService = loadConsentService
  }

  execute() {
    //dispatch evento
    const consent = this._loadConsentService.loadConsent()
    return consent.toJSON()
  }
}

export {LoadUserConsentUseCase}
