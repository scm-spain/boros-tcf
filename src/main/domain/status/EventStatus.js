class EventStatus {
  static USERACTIONCOMPLETE = 'useractioncomplete'
  static CMPUISHOWN = 'cmpuishown'
  static TCLOADED = 'tcloaded'

  constructor({status = EventStatus.TCLOADED} = {}) {
    this._status = status
  }

  get code() {
    return this._status
  }
}

const EVENT_STATUS = 'event_status'

export {EVENT_STATUS, EventStatus}
