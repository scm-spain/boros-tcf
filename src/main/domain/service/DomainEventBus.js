import {ObservableFactory} from './ObservableFactory'
import {inject} from '../../core/ioc/ioc'

export class DomainEventBus {
  constructor({observableFactory = inject(ObservableFactory)} = {}) {
    this._observableFactory = observableFactory
    this._events = new Map()
  }

  get getNumberOfRegisteredEvents() {
    return this._events.size
  }

  getNumberOfObserversRegisteredForAnEvent({eventName}) {
    if (!this._events.has(eventName)) {
      return 0
    }
    return this._events.get(eventName).length
  }

  register({eventName, observer}) {
    if (typeof observer !== 'function') {
      throw new Error('Observer must be a function')
    }
    if (!this._events.has(eventName)) {
      this._events.set(eventName, [])
    }
    const observable = this._observableFactory.create({observer})
    this._events.get(eventName).push(observable)
    return observable.id
  }

  unregister({eventName, reference}) {
    if (!this._events.has(eventName)) {
      return false
    }
    const observers = this._events.get(eventName)
    const index = observers.findIndex(observer => observer.id === reference)
    if (index === -1) {
      return false
    }
    observers.splice(index, 1)
    observers.length === 0 && this._events.delete(eventName)
    return true
  }

  raise({eventName, payload = {}}) {
    if (!this._events.has(eventName)) {
      return
    }
    this._events.get(eventName).forEach(observer => {
      Promise.resolve()
        .then(() => {
          observer.observe({domainEvent: {eventName, payload}})
        })
        .catch(error => console.log('Error' + error))
    })
  }
}
