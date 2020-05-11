import 'jsdom-global/register'
import {expect} from 'chai'
import {TcfApiInitializer} from '../../../main/infrastructure/bootstrap/TcfApiInitializer'
import {waitCondition} from '../../../main/core/service/waitCondition'
import {BorosTcf} from '../../../main/application/BorosTcf'

describe('TcfApiInitializer', () => {
  it('should return instance of BorosTcf with the methods', () => {
    const borosTcf = TcfApiInitializer.init()
    expect(borosTcf instanceof BorosTcf).to.be.true
    expect(typeof borosTcf.getVendorList === 'function').to.be.true
    expect(typeof borosTcf.saveUserConsent === 'function').to.be.true
    expect(typeof borosTcf.loadUserConsent === 'function').to.be.true
    expect(typeof borosTcf.saveUserConsent === 'function').to.be.true
  })
  it('should register the window.__tcfapi command consumer', () => {
    TcfApiInitializer.init()
    const tcfapi = window.__tcfapi
    expect(tcfapi).to.be.a('function')
  })
  it('should register the __tcfapiLocator iframe', () => {
    TcfApiInitializer.init()
    return waitCondition({
      condition: () => window.frames.__tcfapiLocator
    })
  })
})
