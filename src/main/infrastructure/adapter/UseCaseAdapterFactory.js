import {inject} from '../../core/ioc/ioc'
import {DomainEventBus} from '../../domain/service/DomainEventBus'
import {EVENT_USE_CASE_CALLED, EVENT_USE_CASE_ERROR} from '../../core/constants'

export class UseCaseAdapterFactory {
  constructor({domainEventBus = inject(DomainEventBus)} = {}) {
    this._domainEventBus = domainEventBus
  }

  createSync({instance, key}) {
    return {
      execute: params => {
        try {
          const result = instance.execute(params)
          this._raiseCalled({key, params, result})
          return result
        } catch (error) {
          this._raiseError({key, params, error})
          throw error
        }
      }
    }
  }

  createAsync({instance, key}) {
    return {
      execute: params =>
        Promise.resolve()
          .then(() => instance.execute(params))
          .then(result => {
            this._raiseCalled({key, params, result})
            return result
          })
          .catch(error => {
            this._raiseError({key, params, error})
            throw error
          })
    }
  }

  _raiseCalled({key, params, result}) {
    this._domainEventBus.raise({
      eventName: EVENT_USE_CASE_CALLED,
      payload: {
        useCase: key.ID,
        params,
        result
      }
    })
  }

  _raiseError({key, params, error}) {
    this._domainEventBus.raise({
      eventName: EVENT_USE_CASE_ERROR,
      payload: {
        useCase: key.ID,
        params,
        error
      }
    })
  }
}
