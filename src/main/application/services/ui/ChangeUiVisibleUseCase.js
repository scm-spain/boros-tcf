import {inject} from '../../../core/ioc/ioc'
import {DisplayStatusRepository} from '../../../domain/status/DisplayStatusRepository'
import {DisplayStatus} from '../../../domain/status/DisplayStatus'
import {EventStatusService} from '../../../domain/service/EventStatusService'

export class ChangeUiVisibleUseCase {
  constructor({
    displayStatusRepository = inject(DisplayStatusRepository),
    eventStatusService = inject(EventStatusService)
  } = {}) {
    this._displayStatusRepository = displayStatusRepository
    this._eventStatusService = eventStatusService
  }

  execute({visible}) {
    this._displayStatusRepository.setDisplayStatus({
      newStatus: visible ? DisplayStatus.VISIBLE : DisplayStatus.HIDDEN
    })
    this._eventStatusService.updateUiStatus()
  }
}
