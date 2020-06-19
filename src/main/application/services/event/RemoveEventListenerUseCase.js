import {inject} from '../../../core/ioc/ioc'
import {EventStatusService} from '../../../domain/service/EventStatusService'

export class RemoveEventListenerUseCase {
  constructor({eventStatusService = inject(EventStatusService)} = {}) {
    this._eventStatusService = eventStatusService
  }

  execute({callback, listenerId}) {
    this._eventStatusService.removeEventListener({callback, listenerId})
  }
}
