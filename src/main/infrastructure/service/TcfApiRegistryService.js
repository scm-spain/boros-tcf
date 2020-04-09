import {waitCondition} from '../../core/service/waitCondition'
import {inject} from '../../core/ioc/ioc'
import {TcfApiController} from '../controller/TcfApiController'

class TcfApiRegistryService {
  constructor({
    window = inject('window'),
    tcfApiController = inject(TcfApiController)
  } = {}) {
    this._window = window
    this._tcfApiController = tcfApiController
  }

  static start() {
    const service = new TcfApiRegistryService()
    return service.register()
  }

  register() {
    this._registerTcfApiController()
    if (!this._window.frames[TCF_LOCATOR_NAME]) {
      this._registerTcfLocatorIframe()
    }
    return this._window.__tcfapi
  }

  _registerTcfApiController() {
    this._window.__tcfapi = (command, version, callback, parameter) =>
      this._tcfApiController.process(command, version, callback, parameter)
  }

  _registerTcfLocatorIframe() {
    waitCondition({
      condition: () => !!this._window.document.body,
      timeout: CHECK_BODY_TIMEOUT
    }).then(() => {
      const iframe = this._window.document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.name = TCF_LOCATOR_NAME
      this._window.document.body.appendChild(iframe)
    })
  }
}

const TCF_LOCATOR_NAME = '__tcfapiLocator'
const CHECK_BODY_TIMEOUT = 100

export {TcfApiRegistryService}
