import {inject} from '../../../core/ioc/ioc'
import {EventStatusService} from '../../../domain/service/EventStatusService'

export class AddEventListenerUseCase {
  constructor({eventStatusService = inject(EventStatusService)} = {}) {
    this._eventStatusService = eventStatusService
  }

  execute({callback}) {
    this._eventStatusService.addEventListener({callback})
  }
}
