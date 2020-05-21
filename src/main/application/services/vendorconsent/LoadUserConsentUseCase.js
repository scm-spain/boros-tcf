import {inject} from '../../../core/ioc/ioc'
import {LoadConsentService} from '../../../domain/consent/LoadConsentService'

class LoadUserConsentUseCase {
  constructor({loadConsentService = inject(LoadConsentService)} = {}) {
    this._loadConsentService = loadConsentService
  }

  execute() {
    // dispatch evento
    const consent = this._loadConsentService.loadConsent()
    return consent.toJSON()
  }
}

export {LoadUserConsentUseCase}
