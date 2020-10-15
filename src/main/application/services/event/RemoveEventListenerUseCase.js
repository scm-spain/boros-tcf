import {inject} from '../../../core/ioc/ioc'
import {EventStatusService} from '../../../domain/service/EventStatusService'
import {SyncUseCase} from '../SyncUseCase'

export class RemoveEventListenerUseCase extends SyncUseCase {
  constructor({eventStatusService = inject(EventStatusService)} = {}) {
    super()
    this._eventStatusService = eventStatusService
  }

  execute({callback, listenerId}) {
    this._eventStatusService.removeEventListener({callback, listenerId})
  }
}

RemoveEventListenerUseCase.ID = 'RemoveEventListenerUseCase'
