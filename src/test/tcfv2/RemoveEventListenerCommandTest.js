import {expect} from 'chai'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
describe('removeEventListenerCommand Should', () => {
  const removeEventListener = 'removeEventListener'
  const addEventListener = 'addEventListener'
  const version = 2
  it('given a eventListener that has been added, when removeEventListenerCommand is called then should return success', done => {
    TestableTcfApiInitializer.create().init()
    window.__tcfapi(addEventListener, version, (tcData, success) => {
      window.__tcfapi(
        removeEventListener,
        version,
        success => {
          expect(success).to.be.true
          done()
        },
        tcData.listenerId
      )
    })
  })
  it(
    'given a eventListener that has NOT been added, when removeEventListenerCommand is called , ' +
      'then the callback function should be called with parameter success to false',
    () => {
      window.__tcfapi(
        removeEventListener,
        version,
        success => {
          expect(success).to.be.false
        },
        'unexistentListenerId'
      )
    }
  )
})
