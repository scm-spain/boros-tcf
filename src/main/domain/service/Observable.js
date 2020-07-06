export class Observable {
  constructor({id, observer} = {}) {
    this._id = id
    this._observer = observer
  }

  observe({domainEvent} = {}) {
    this._observer(domainEvent)
  }

  get id() {
    return this._id
  }
}
