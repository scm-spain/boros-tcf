import {expect} from 'chai'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {StatusRepository} from '../../main/domain/status/StatusRepository'
import {Status} from '../../main/domain/status/Status'
describe('removeEventListenerCommand Should', () => {
  const removeEventListener = 'removeEventListener'
  const addEventListener = 'addEventListener'
  const version = 2
  it('given a eventListener that has been added, when removeEventListenerCommand is called then should return success', done => {
    const statusMock = {
      eventStatus: Status.TCLOADED,
      cmpStatus: Status.CMPSTATUS_LOADING,
      displayStatus: Status.DISPLAYSTATUS_VISIBLE
    }
    const statusRepositoryMock = {
      getStatus: () => statusMock
    }
    TestableTcfApiInitializer.create()
      .mock(StatusRepository, statusRepositoryMock)
      .init()
    window.__tcfapi(addEventListener, version, tcData => {
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
