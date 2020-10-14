import {inject} from '../../../core/ioc/ioc'
import {LoadConsentService} from '../../../domain/consent/LoadConsentService'
import {EventStatusService} from '../../../domain/service/EventStatusService'
import {ConsentFactory} from '../../../domain/consent/ConsentFactory'
import {AsyncUseCase} from '../AsyncUseCase'
import {DomainEventBus} from '../../../domain/service/DomainEventBus'
import {EVENT_LOAD_CONSENT_ERROR} from '../../../core/constants'

export class LoadUserConsentUseCase extends AsyncUseCase {
  constructor({
    domainEventBus = inject(DomainEventBus),
    loadConsentService = inject(LoadConsentService),
    eventStatusService = inject(EventStatusService),
    consentFactory = inject(ConsentFactory)
  } = {}) {
    super()
    this._domainEventBus = domainEventBus
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
      this._domainEventBus.raise({
        eventName: EVENT_LOAD_CONSENT_ERROR,
        payload: {
          error
        }
      })
      const consent = this._consentFactory.createEmpty()
      return consent.toJSON()
    }
  }
}

LoadUserConsentUseCase.ID = 'LoadUserConsentUseCase'
