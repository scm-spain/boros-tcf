import {inject} from '../../core/ioc/ioc'
import {DomainEventBus} from './DomainEventBus'
import {GetTCDataUseCase} from '../../application/services/tcdata/GetTCDataUseCase'
import {StatusRepository} from '../status/StatusRepository'
import {Status} from '../status/Status'

export class EventStatusService {
  constructor({
    domainEventBus = inject(DomainEventBus),
    getTCDataUseCase = inject(GetTCDataUseCase),
    statusRepository = inject(StatusRepository)
  } = {}) {
    this._domainEventBus = domainEventBus
    this._getTCDataUseCase = getTCDataUseCase
    this._status = statusRepository.getStatus()
  }

  _getEventStatus() {
    const {cmpStatus, displayStatus} = this._status
    let eventStatus = null
    if (cmpStatus === Status.CMPSTATUS_LOADED) {
      eventStatus = Status.TCLOADED
    }
    switch (displayStatus) {
      case Status.DISPLAYSTATUS_VISIBLE:
        eventStatus = Status.CMPUISHOWN
        break
      case Status.DISPLAYSTATUS_HIDDEN:
        eventStatus = Status.USERACTIONCOMPLETE
        break
    }
    return eventStatus
  }

  updateUiStatus() {
    this._status.eventStatus = this._getEventStatus()
    const tcData = this._getTCDataUseCase.execute()
    this._domainEventBus.raise({
      eventName: EVENT_STATUS,
      payload: {
        TCData: tcData
      }
    })
  }

  updateTCLoaded() {
    this._status.eventStatus = this._getEventStatus()
    const tcData = this._getTCDataUseCase.execute()
    this._domainEventBus.raise({
      eventName: EVENT_STATUS,
      payload: {
        TCData: tcData
      }
    })
  }

  addEventListener({callback}) {
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

    const tcData = this._getTCDataUseCase.execute()
    tcData.listenerId = reference

    callback(tcData, true)
  }

  removeEventListener({callback, listenerId}) {
    const success = this._domainEventBus.unregister({
      eventName: EVENT_STATUS,
      reference: listenerId
    })
    callback(success)
  }
}

const EVENT_STATUS = 'event_status'
