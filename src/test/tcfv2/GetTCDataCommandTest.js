import 'jsdom-global/register'
import {expect} from 'chai'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'

describe('getTCData', () => {
  const command = 'getTCData'
  const version = 2
  it('should sucess', () => {
    TestableTcfApiInitializer.create().init()
    window.__tcfapi(command, version, (pingReturn, success) => {
      // TODO: implement
      expect(success).to.be.true
    })
  })
})
