import {inject} from '../../core/ioc/ioc'
import {CmpStatusRepository} from '../status/CmpStatusRepository'
import {DisplayStatusRepository} from '../status/DisplayStatusRepository'
import {CmpStatus} from '../status/CmpStatus'
import {EVENT_STATUS, EventStatus} from '../status/EventStatus'
import {DisplayStatus} from '../status/DisplayStatus'
import {DomainEventBus} from './DomainEventBus'

export class EventStatusService {
  constructor({
    cmpStatusRepository = inject(CmpStatusRepository),
    displayStatusRepository = inject(DisplayStatusRepository),
    domainEventBus = inject(DomainEventBus)
  } = {}) {
    this._cmpStatusRepository = cmpStatusRepository
    this._displayStatusRepository = displayStatusRepository
    this._domainEventBus = domainEventBus
  }

  getEventStatus() {
    const cmpStatus = this._cmpStatusRepository.getCmpStatus().code
    const displayStatus = this._displayStatusRepository.getDisplayStatus().code
    let eventStatus
    if (cmpStatus === CmpStatus.LOADED) {
      eventStatus = EventStatus.TCLOADED
    }
    if (displayStatus === DisplayStatus.VISIBLE) {
      eventStatus = EventStatus.CMPUISHOWN
    }
    return eventStatus
  }

  updateUiStatus() {
    const displayStatus = this._displayStatusRepository.getDisplayStatus()
    const eventStatus =
      displayStatus === DisplayStatus.VISIBLE
        ? EventStatus.CMPUISHOWN
        : EventStatus.USERACTIONCOMPLETE

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

    // TODO  get TCData

    const cmpStatus = this._cmpStatusRepository.getCmpStatus().code
    const displayStatus = this._displayStatusRepository.getDisplayStatus().code

    const eventStatus = this.getEventStatus()

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

  removeEventListener({callback, listenerId}) {
    const success = this._domainEventBus.unregister({
      eventName: EVENT_STATUS,
      reference: listenerId
    })
    callback(success)
  }
}
