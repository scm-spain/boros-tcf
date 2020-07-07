import {Observable} from './Observable'

export class ObservableEventStatus extends Observable {
  constructor({id, observer} = {}) {
    super({id, observer})
  }

  observe({domainEvent} = {}) {
    const newTCData = {...domainEvent.payload.TCData, listenerId: this.id}
    this._observer(newTCData, true)
  }
}
