import {inject} from '../../../core/ioc/ioc'
import {LoadConsentService} from '../../../domain/consent/LoadConsentService'
import {EventStatusService} from '../../../domain/service/EventStatusService'
import {ConsentFactory} from '../../../domain/consent/ConsentFactory'

class LoadUserConsentUseCase {
  constructor({
    loadConsentService = inject(LoadConsentService),
    eventStatusService = inject(EventStatusService),
    consentFactory = inject(ConsentFactory)
  } = {}) {
    this._loadConsentService = loadConsentService
    this._eventStatusService = eventStatusService
    this._consentFactory = consentFactory
  }

  async execute({notify = false} = {}) {
    try {
      const consent = await this._loadConsentService.loadConsent()
      const consentDto = consent.toJSON()
      if (consentDto.valid) {
        this._eventStatusService.updateTCLoaded({notify})
      }
      return consentDto
    } catch (error) {
      const consent = this._consentFactory.createEmpty()
      return consent.toJSON()
    }
  }
}

export {LoadUserConsentUseCase}
