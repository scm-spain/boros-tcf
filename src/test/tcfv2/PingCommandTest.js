import 'jsdom-global/register'
import {expect} from 'chai'
import {PingReturn} from '../../main/domain/ping/PingReturn'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'

describe('ping', () => {
  const command = 'ping'
  const version = 2
  it('should return a PingReturn object', () => {
    TestableTcfApiInitializer.create().init()
    window.__tcfapi(command, version, (pingReturn, success) => {
      expect(success).to.be.true
      expect(pingReturn).to.be.instanceOf(PingReturn)
    })
  })
})
