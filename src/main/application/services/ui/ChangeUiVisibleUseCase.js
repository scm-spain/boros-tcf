import {DomainEventBus} from '../../../domain/service/DomainEventBus'
import {inject} from '../../../core/ioc/ioc'
import {DisplayStatusRepository} from '../../../domain/status/DisplayStatusRepository'
import {DisplayStatus} from '../../../domain/status/DisplayStatus'
import {EVENT_STATUS, EventStatus} from '../../../domain/status/EventStatus'

export class ChangeUiVisibleUseCase {
  constructor({
    domainEventBus = inject(DomainEventBus),
    displayStatusRepository = inject(DisplayStatusRepository)
  } = {}) {
    this._domainEventBus = domainEventBus
    this._displayStatusRepository = displayStatusRepository
  }

  execute({visible}) {
    let eventStatus
    if (visible === false) {
      this._displayStatusRepository.setDisplayStatus({
        newStatus: DisplayStatus.HIDDEN
      })
      eventStatus = EventStatus.USERACTIONCOMPLETE
    } else {
      this._displayStatusRepository.setDisplayStatus({
        newStatus: DisplayStatus.VISIBLE
      })
      eventStatus = EventStatus.CMPUISHOWN
    }
    // TODO  get TCData
    const TCData = {
      description: 'This TCData should be get from repository',
      eventStatus
    }
    this._domainEventBus.raise({
      eventName: EVENT_STATUS,
      payload: {
        TCData
      }
    })
  }
}
