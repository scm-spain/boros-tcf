import {DomainEventBus} from '../../../domain/service/DomainEventBus'
import {inject} from '../../../core/ioc/ioc'
import {EVENT_STATUS} from '../../../domain/status/EventStatus'
import {CmpStatusRepository} from '../../../domain/status/CmpStatusRepository'
import {DisplayStatusRepository} from '../../../domain/status/DisplayStatusRepository'
import {EventStatusService} from '../../../domain/service/EventStatusService'

export class AddEventListenerUseCase {
  constructor({eventStatusService = inject(EventStatusService)} = {}) {
    this._eventStatusService = eventStatusService
  }

  execute({callback}) {
    this._eventStatusService.addEventListener({callback})
  }
}
