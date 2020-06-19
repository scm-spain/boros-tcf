import {Observable} from './Observable'

export class ObservableEventStatus extends Observable {
  constructor({observer} = {}) {
    super({observer})
  }

  observe({domainEvent} = {}) {
    const newTCData = {...domainEvent.payload.TCData, listenerId: this}
    this._observer(newTCData, true)
  }
}