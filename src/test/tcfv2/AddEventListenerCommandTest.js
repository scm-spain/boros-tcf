import {expect} from 'chai'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import sinon from 'sinon'
import {waitCondition} from '../../main/core/service/waitCondition'
import {EventStatus} from '../../main/domain/status/EventStatus'
import {CmpStatusRepository} from '../../main/domain/status/CmpStatusRepository'
import {CmpStatus} from '../../main/domain/status/CmpStatus'
import {DomainEventBus} from '../../main/domain/service/DomainEventBus'
import {DisplayStatusRepository} from '../../main/domain/status/DisplayStatusRepository'
import {DisplayStatus} from '../../main/domain/status/DisplayStatus'
import {TestableCookieStorageMock} from '../testable/infrastructure/repository/TestableCookieStorageMock'
import {CookieConsentRepository} from '../../main/infrastructure/repository/CookieConsentRepository'
describe('AddEventListenerCommand Should', () => {
  const command = 'addEventListener'
  const version = 2
  describe('General AddEventListenerCommand Scenarios', () => {
    it('when we create an event listener, then listener callback should be immediately called', done => {
      TestableTcfApiInitializer.create().init()
      window.__tcfapi(command, version, () => {
        expect(true).to.be.true
        done()
      })
    })
    it('when we create an event listener, and the cmpStatus is loading, then listener callback should be immediately called and listenerId exists', done => {
      const cookieStorageMock = new TestableCookieStorageMock()
      const cmpStatusRepository = {
        getCmpStatus: () => {
          return {
            code: CmpStatus.LOADING
          }
        }
      }
      TestableTcfApiInitializer.create()
        .mock(CookieConsentRepository, cookieStorageMock)
        .mock(CmpStatusRepository, cmpStatusRepository)
        .init()
        .saveUserConsent({
          vendor: {consents: {}, legitimateInterests: {}},
          purpose: {consents: {}, legitimateInterests: {}},
          specialFeatures: {}
        })

      window.__tcfapi(command, version, (TCData, success) => {
        expect(success).to.be.true
        expect(TCData.cmpStatus).equal(CmpStatus.LOADING)
        expect(TCData.listenerId).exist
        done()
      })
    })
    it('when we create an event listener, when could not be registered as a listener, callback should be invoked with false', done => {
      const domainEventBus = {
        register: () => {
          throw new Error('Error registering')
        }
      }
      TestableTcfApiInitializer.create()
        .mock(DomainEventBus, domainEventBus)
        .init()
      window.__tcfapi(command, version, (TCData, success) => {
        expect(success).to.be.false
        done()
      })
    })
  })
  describe('tcloaded Scenarios', () => {
    it('When CMP Status is loaded eventStatus should be tcloaded', done => {
      const cmpStatusRepository = {
        getCmpStatus: () => {
          return {
            code: CmpStatus.LOADED
          }
        }
      }
      TestableTcfApiInitializer.create()
        .mock(CmpStatusRepository, cmpStatusRepository)
        .init()

      window.__tcfapi(command, version, (TCData, status) => {
        expect(TCData.eventStatus).to.equal(EventStatus.TCLOADED)
        expect(TCData.listenerId).exist
        done()
      })
    })
    it('EventStatus should not be tcloaded', done => {
      const cmpStatusRepository = {
        getCmpStatus: () => {
          return {
            code: CmpStatus.LOADED
          }
        }
      }
      const displayStatusRepository = {
        getDisplayStatus: () => {
          return {
            code: DisplayStatus.VISIBLE
          }
        }
      }
      TestableTcfApiInitializer.create()
        .mock(CmpStatusRepository, cmpStatusRepository)
        .mock(DisplayStatusRepository, displayStatusRepository)
        .init()

      window.__tcfapi(command, version, (TCData, status) => {
        expect(TCData.eventStatus).to.not.equal(EventStatus.TCLOADED)
        expect(TCData.listenerId).exist
        done()
      })
    })
  })
  describe('cmpuishown Scenarios', () => {
    it('EventStatus should be cmpuishown when UI is surfaced', done => {
      const displayStatusRepository = {
        getDisplayStatus: () => {
          return {
            code: DisplayStatus.VISIBLE
          }
        }
      }
      TestableTcfApiInitializer.create()
        .mock(DisplayStatusRepository, displayStatusRepository)
        .init()

      window.__tcfapi(command, version, (TCData, status) => {
        expect(TCData.eventStatus).to.equal(EventStatus.CMPUISHOWN)
        expect(TCData.listenerId).exist
        done()
      })
    })
  })
  describe('useractioncomplete Scenarios', () => {
    let borosTcf
    beforeEach(() => {
      const cmpStatusRepository = {
        getCmpStatus: () => {
          return {
            code: CmpStatus.LOADED
          }
        }
      }
      const cookieStorageMock = new TestableCookieStorageMock()

      borosTcf = TestableTcfApiInitializer.create()
        .mock(CookieConsentRepository, cookieStorageMock)
        .mock(CmpStatusRepository, cmpStatusRepository)
        .init()
      borosTcf.saveUserConsent({
        vendor: {consents: {}, legitimateInterests: {}},
        purpose: {consents: {}, legitimateInterests: {}},
        specialFeatures: {}
      })
    })
    it('EventStatus should be tcloaded when user has confirmed o re confirmed their choices before registering', done => {
      borosTcf.uiVisible({visible: false})
      window.__tcfapi(command, version, (TCData, status) => {
        expect(TCData.eventStatus).to.equal(EventStatus.TCLOADED)
        expect(TCData.listenerId).exist
        done()
      })
    })
    it('EventStatus should be useractioncomplete when user has confirmed o re confirmed their choices after registering', done => {
      let firstTime = true
      const callback = TCData => {
        if (firstTime) {
          expect(TCData.eventStatus).to.equal(EventStatus.TCLOADED)
          expect(TCData.listenerId).exist
          firstTime = false
        } else {
          expect(TCData.eventStatus).to.equal(EventStatus.USERACTIONCOMPLETE)
          expect(TCData.listenerId).exist
          done()
        }
      }

      window.__tcfapi(command, version, callback)
      borosTcf.uiVisible({visible: false})
    })
  })
  it('when we create an event listener, then listener callback should be immediately called', done => {
    TestableTcfApiInitializer.create().init()
    window.__tcfapi(command, version, () => {
      expect(true).to.be.true
      done()
    })
  })
  it('when we create an event listener and an event is raised, then listener callback should be called', done => {
    const borosTcf = TestableTcfApiInitializer.create().init()

    const callback = () => null
    const spyCallback = sinon.spy(callback)
    window.__tcfapi(command, version, spyCallback)

    expect(spyCallback.calledOnce).to.be.true

    borosTcf.uiVisible({visible: true})

    waitCondition({condition: () => spyCallback.callCount === 2}).then(() =>
      done()
    )
  })
  it('when we create an event listener and an event is raised, then The TCData object will contain CMP-assigned listenerId for the registered listener', done => {
    // const cookieStorageMock = new TestableCookieStorageMock()
    const cmpStatusRepositoryMock = {
      getCmpStatus: () => {
        return {
          code: CmpStatus.LOADED
        }
      }
    }
    const borosTcf = TestableTcfApiInitializer.create()
      // .mock(CookieStorage, cookieStorageMock)
      .mock(CmpStatusRepository, cmpStatusRepositoryMock)
      .init()
    borosTcf.saveUserConsent({
      vendor: {consents: {}, legitimateInterests: {}},
      purpose: {consents: {}, legitimateInterests: {}},
      specialFeatures: {}
    })

    let listenerId
    const callback = TCData => {
      expect(TCData.listenerId).not.to.be.undefined
      if (!listenerId) {
        listenerId = TCData.listenerId
      } else {
        expect(TCData.listenerId).to.be.equal(listenerId)
        done()
      }
    }
    const spyCallback = sinon.spy(callback)
    window.__tcfapi(command, version, spyCallback)
    borosTcf.uiVisible({visible: true})
  })
  it('when addEventListener is called, then TCData should be present and contain listenerId', done => {
    TestableTcfApiInitializer.create().init()

    window.__tcfapi(command, version, (tcData, success) => {
      expect(tcData.listenerId !== undefined).to.be.true
      done()
    })
  })
  it('when addEventListener is called,  eventStatus property of the TCData object shall be one of the following tcloaded, cmpuishown, useractioncomplete', done => {
    const borosTcf = TestableTcfApiInitializer.create().init()
    let uiVisibleCalled = false
    const callback = (TCData, success) => {
      if (uiVisibleCalled) {
        expect(TCData.eventStatus).to.be.equal(EventStatus.CMPUISHOWN)
        done()
      }
    }
    const spyCallback = sinon.spy(callback)
    window.__tcfapi(command, version, spyCallback)
    waitCondition({condition: () => spyCallback.calledOnce})
      .then(() => {
        uiVisibleCalled = true
        borosTcf.uiVisible({visible: true})
      })
      .then(() => {
        waitCondition({condition: () => spyCallback.callCount === 2})
      })
  })
})
