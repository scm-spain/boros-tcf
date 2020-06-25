import {inject} from '../../../core/ioc/ioc'
import {LoadConsentService} from '../../../domain/consent/LoadConsentService'
import {EventStatusService} from '../../../domain/service/EventStatusService'
import {CmpStatusRepository} from '../../../domain/status/CmpStatusRepository'
import {CmpStatus} from '../../../domain/status/CmpStatus'

class LoadUserConsentUseCase {
  constructor({
    loadConsentService = inject(LoadConsentService),
    eventStatusService = inject(EventStatusService),
    cmpStatusRepository = inject(CmpStatusRepository)
  } = {}) {
    this._loadConsentService = loadConsentService
    this._eventStatusService = eventStatusService
    this._cmpStatusRepository = cmpStatusRepository
  }

  async execute() {
    const consent = await this._loadConsentService.loadConsent()
    const consentDto = consent.toJSON()
    if (consentDto.valid) {
      const newCmpStatus = CmpStatus.cmpStatusLoaded()
      this._cmpStatusRepository.setCmpStatus({
        newCmpStatus
      })
      this._eventStatusService.updateTCLoaded()
    }
    return consentDto
  }
}

export {LoadUserConsentUseCase}
