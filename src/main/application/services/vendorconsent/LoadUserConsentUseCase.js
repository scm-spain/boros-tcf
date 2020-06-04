import {inject} from '../../../core/ioc/ioc'
import {LoadConsentService} from '../../../domain/consent/LoadConsentService'

class LoadUserConsentUseCase {
  constructor({loadConsentService = inject(LoadConsentService)} = {}) {
    this._loadConsentService = loadConsentService
  }

  async execute() {
    // TODO dispatch required IAB event
    const consent = await this._loadConsentService.loadConsent()
    return consent.toJSON()
  }
}

export {LoadUserConsentUseCase}
