import 'jsdom-global/register'
import {expect} from 'chai'
import {TcfApiInitializer} from '../../main/infrastructure/bootstrap/TcfApiInitializer'
import {PingReturn} from '../../main/domain/ping/PingReturn'

describe('ping', () => {
  const tcfapi = TcfApiInitializer.init({window})
  const command = 'ping'
  const version = 2
  it('should return a PingReturn object', () => {
    tcfapi(command, version, (pingReturn, success) => {
      expect(success).to.be.true
      expect(pingReturn).to.be.instanceOf(PingReturn)
    })
  })
})
