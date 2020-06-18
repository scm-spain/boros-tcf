export class Observable {
  constructor({observer} = {}) {
    this._observer = observer
  }

  observe({domainEvent} = {}) {
    this._observer(domainEvent)
  }
}
