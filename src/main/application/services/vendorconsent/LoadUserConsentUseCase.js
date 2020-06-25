import {inject} from '../../../core/ioc/ioc'
import {LoadConsentService} from '../../../domain/consent/LoadConsentService'
import {EventStatusService} from '../../../domain/service/EventStatusService'
import {StatusRepository} from '../../../domain/status/StatusRepository'
import {Status} from '../../../domain/status/Status'

class LoadUserConsentUseCase {
  _statusRepository
  constructor({
    loadConsentService = inject(LoadConsentService),
    eventStatusService = inject(EventStatusService),
    statusRepository = inject(StatusRepository)
  } = {}) {
    this._loadConsentService = loadConsentService
    this._eventStatusService = eventStatusService
    this._status = statusRepository.getStatus()
  }

  async execute() {
    const consent = await this._loadConsentService.loadConsent()
    const consentDto = consent.toJSON()
    if (consentDto.valid) {
      this._status.cmpStatus = Status.CMPSTATUS_LOADED
      this._eventStatusService.updateTCLoaded()
    }
    return consentDto
  }
}

export {LoadUserConsentUseCase}
