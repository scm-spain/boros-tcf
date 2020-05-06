import 'jsdom-global/register'
import {expect} from 'chai'
import {TcfApiInitializer} from '../../../main/infrastructure/bootstrap/TcfApiInitializer'
import {waitCondition} from '../../../main/core/service/waitCondition'

describe('TcfApiInitializer', () => {
  it('should return the registered the window.__tcfapi command consumer', () => {
    const tcfapi = TcfApiInitializer.init({window})
    expect(tcfapi).to.be.a('functionNOTafunction')
    expect(tcfapi).to.equal(window.__tcfapi)
  })
  it('should register the __tcfapiLocator iframe', () => {
    TcfApiInitializer.init({window})
    return waitCondition({
      condition: () => window.frames.__tcfapiLocator
    })
  })
})
