import {inject} from '../../core/ioc/ioc'
import {TcfApiController} from '../controller/TcfApiController'

class TcfApiRegistryService {
  constructor({tcfApiController = inject(TcfApiController)} = {}) {
    this._tcfApiController = tcfApiController
  }

  register({borosTcf}) {
    if (typeof window === 'undefined') return
    const onReady = this._getStubbed(ON_READY_COMMAND)
    const pending = this._getStubbed(PENDING_COMMAND)

    window.__tcfapi = (command, version, callback, parameter) =>
      this._tcfApiController.process(command, version, callback, parameter)

    this._run(() => onReady && onReady(borosTcf))
    this._run(
      () => pending && pending.forEach(pendingFunction => pendingFunction())
    )
  }

  _getStubbed(command) {
    try {
      return window.__tcfapi(command) || null
    } catch (error) {
      return null
    }
  }

  _run(initialization) {
    try {
      initialization()
    } catch (ignored) {}
  }
}

const PENDING_COMMAND = 'pending'
const ON_READY_COMMAND = 'onReady'

export {TcfApiRegistryService}
