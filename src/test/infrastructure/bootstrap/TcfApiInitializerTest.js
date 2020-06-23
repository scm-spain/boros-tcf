import jsdom from 'jsdom-global'
import {expect} from 'chai'
import {TcfApiInitializer} from '../../../main/infrastructure/bootstrap/TcfApiInitializer'
import {BorosTcf} from '../../../main/application/BorosTcf'
import {TcfApiV2} from '../../../main/application/TcfApiV2'

describe('TcfApiInitializer', () => {
  beforeEach(() => jsdom())

  it('should return instance of BorosTcf with the methods', () => {
    const borosTcf = TcfApiInitializer.init()
    expect(borosTcf instanceof BorosTcf).to.be.true
  })
  it('should register the window.__tcfapi command consumer', () => {
    TcfApiInitializer.init()
    const tcfapi = window.__tcfapi
    expect(tcfapi).to.be.a('function')
  })
  it('should process pending commands', done => {
    const pending = [() => done()]
    window.__tcfapi = command => {
      if (command === 'pending') return pending
    }
    TcfApiInitializer.init()
  })
  it('should process the onReady callback', done => {
    const onReady = api => {
      expect(api instanceof TcfApiV2).to.be.true
      done()
    }
    window.__tcfapi = command => {
      if (command === 'onReady') return onReady
    }
    TcfApiInitializer.init()
  })
})
