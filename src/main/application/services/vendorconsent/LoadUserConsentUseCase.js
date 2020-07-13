import {inject} from '../../../core/ioc/ioc'
import {LoadConsentService} from '../../../domain/consent/LoadConsentService'
import {EventStatusService} from '../../../domain/service/EventStatusService'

class LoadUserConsentUseCase {
  constructor({
    loadConsentService = inject(LoadConsentService),
    eventStatusService = inject(EventStatusService)
  } = {}) {
    this._loadConsentService = loadConsentService
    this._eventStatusService = eventStatusService
  }

  async execute({notify = false} = {}) {
    const consent = await this._loadConsentService.loadConsent()
    const consentDto = consent.toJSON()
    if (consentDto.valid) {
      this._eventStatusService.updateTCLoaded({notify})
    }
    return consentDto
  }
}

export {LoadUserConsentUseCase}
