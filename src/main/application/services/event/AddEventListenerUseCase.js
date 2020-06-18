import {DomainEventBus} from '../../../domain/service/DomainEventBus'
import {inject} from '../../../core/ioc/ioc'
import {EVENT_STATUS} from '../../../domain/status/EventStatus'
import {CmpStatusRepository} from '../../../domain/status/CmpStatusRepository'
import {DisplayStatusRepository} from '../../../domain/status/DisplayStatusRepository'
import {EventStatusService} from '../../../domain/service/EventStatusService'

export class AddEventListenerUseCase {
  constructor({
    domainEventBus = inject(DomainEventBus),
    cmpStatusRepository = inject(CmpStatusRepository),
    displayStatusRepository = inject(DisplayStatusRepository),
    eventStatusService = inject(EventStatusService)
  } = {}) {
    this._domainEventBus = domainEventBus
    this._cmpStatusRepository = cmpStatusRepository
    this._displayStatusRepository = displayStatusRepository
    this._eventStatusService = eventStatusService
  }

  execute({callback}) {
    let reference

    try {
      reference = this._domainEventBus.register({
        eventName: EVENT_STATUS,
        observer: callback
      })
    } catch (error) {
      callback(null, false)
      return
    }

    // TODO  get TCData

    const cmpStatus = this._cmpStatusRepository.getCmpStatus().code
    const displayStatus = this._displayStatusRepository.getDisplayStatus().code

    const eventStatus = this._eventStatusService.getEventStatus()

    const TCData = {
      listenerId: reference,
      // TODO Add here eventStatus
      cmpStatus,
      eventStatus: eventStatus,
      displayStatus
    }

    // END TODO  get TCData

    callback(TCData, true)
  }
}
