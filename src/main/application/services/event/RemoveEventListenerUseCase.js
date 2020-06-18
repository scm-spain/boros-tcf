import {DomainEventBus} from '../../../domain/service/DomainEventBus'
import {EVENT_STATUS} from '../../../domain/status/EventStatus'
import {inject} from '../../../core/ioc/ioc'

export class RemoveEventListenerUseCase {
  constructor({domainEventBus = inject(DomainEventBus)} = {}) {
    this._domainEventBus = domainEventBus
  }

  execute({callback, listenerId}) {
    const success = this._domainEventBus.unregister({
      eventName: EVENT_STATUS,
      reference: listenerId
    })
    callback(success)
  }
}
