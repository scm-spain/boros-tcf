import {inject} from '../../../core/ioc/ioc'

import {EventStatusService} from '../../../domain/service/EventStatusService'
import {StatusRepository} from '../../../domain/status/StatusRepository'
import {Status} from '../../../domain/status/Status'

export class ChangeUiVisibleUseCase {
  constructor({
    statusRepository = inject(StatusRepository),
    eventStatusService = inject(EventStatusService)
  } = {}) {
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
