import {expect} from 'chai'
import sinon from 'sinon'
import {TcfApiController} from '../../../main/infrastructure/controller/TcfApiController'

describe('TcfApiController', () => {
  const tcfApi = {ping: f => f({}, true)}
  const pingSpy = sinon.spy(tcfApi, 'ping')
  beforeEach(() => {
    pingSpy.resetHistory()
  })

  it('should reject v1 calls', () => {
    const controller = new TcfApiController({tcfApi})
    controller.process('ping', 1, (value, success) => {
      expect(success).to.be.false
      expect(pingSpy.called).to.be.false
    })
  })
  it('should reject unexisting method calls', () => {
    const controller = new TcfApiController({tcfApi})
    controller.process('invent', 2, (value, success) => {
      expect(success).to.be.false
      expect(pingSpy.called).to.be.false
    })
  })
  it('should accept undefined version parameter', () => {
    const controller = new TcfApiController({tcfApi})
    controller.process('ping', undefined, (value, success) => {
      expect(success).to.be.true
      expect(pingSpy.called).to.be.true
    })
  })
})
