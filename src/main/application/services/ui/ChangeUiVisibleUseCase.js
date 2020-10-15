import {inject} from '../../../core/ioc/ioc'

import {EventStatusService} from '../../../domain/service/EventStatusService'
import {StatusRepository} from '../../../domain/status/StatusRepository'
import {Status} from '../../../domain/status/Status'
import {SyncUseCase} from '../SyncUseCase'

export class ChangeUiVisibleUseCase extends SyncUseCase {
  constructor({
    statusRepository = inject(StatusRepository),
    eventStatusService = inject(EventStatusService)
  } = {}) {
    super()
    this._status = statusRepository.getStatus()
    this._eventStatusService = eventStatusService
  }

  execute({visible}) {
    this._status.displayStatus = visible
      ? Status.DISPLAYSTATUS_VISIBLE
      : Status.DISPLAYSTATUS_HIDDEN
    this._eventStatusService.updateUiStatus()
  }
}

ChangeUiVisibleUseCase.ID = 'ChangeUiVisibleUseCase'
