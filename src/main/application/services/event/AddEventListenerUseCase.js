import {inject} from '../../../core/ioc/ioc'
import {EventStatusService} from '../../../domain/service/EventStatusService'
import {SyncUseCase} from '../SyncUseCase'

export class AddEventListenerUseCase extends SyncUseCase {
  constructor({eventStatusService = inject(EventStatusService)} = {}) {
    super()
    this._eventStatusService = eventStatusService
  }

  execute({callback}) {
    this._eventStatusService.addEventListener({callback})
  }
}

AddEventListenerUseCase.ID = 'AddEventListenerUseCase'
