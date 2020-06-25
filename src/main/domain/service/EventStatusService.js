import {inject} from '../../core/ioc/ioc'
import {CmpStatus} from '../status/CmpStatus'
import {EVENT_STATUS, EventStatus} from '../status/EventStatus'
import {DisplayStatus} from '../status/DisplayStatus'
import {DomainEventBus} from './DomainEventBus'
import {GetTCDataUseCase} from '../../application/services/tcdata/GetTCDataUseCase'

export class EventStatusService {
  constructor({
    domainEventBus = inject(DomainEventBus),
    getTCDataUseCase = inject(GetTCDataUseCase)
  } = {}) {
    this._domainEventBus = domainEventBus
    this._getTCDataUseCase = getTCDataUseCase
  }

  static getEventStatus({cmpStatusRepository, displayStatusRepository}) {
    const cmpStatus = cmpStatusRepository.getCmpStatus().code
    const displayStatus = displayStatusRepository.getDisplayStatus().code
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

    callback(tcData.value(), true)
  }

  removeEventListener({callback, listenerId}) {
    const success = this._domainEventBus.unregister({
      eventName: EVENT_STATUS,
      reference: listenerId
    })
    callback(success)
  }
}
