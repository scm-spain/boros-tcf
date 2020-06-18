import {inject} from '../../core/ioc/ioc'
import {CmpStatusRepository} from '../status/CmpStatusRepository'
import {DisplayStatusRepository} from '../status/DisplayStatusRepository'
import {CmpStatus} from '../status/CmpStatus'
import {EventStatus} from '../status/EventStatus'
import {DisplayStatus} from '../status/DisplayStatus'

export class EventStatusService {
  constructor({
    cmpStatusRepository = inject(CmpStatusRepository),
    displayStatusRepository = inject(DisplayStatusRepository)
  } = {}) {
    this._cmpStatusRepository = cmpStatusRepository
    this._displayStatusRepository = displayStatusRepository
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
}
