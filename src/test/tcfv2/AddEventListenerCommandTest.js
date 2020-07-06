import {expect} from 'chai'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import sinon from 'sinon'
import {waitCondition} from '../../main/core/service/waitCondition'
import {DomainEventBus} from '../../main/domain/service/DomainEventBus'
import {TestableCookieStorageMock} from '../testable/infrastructure/repository/TestableCookieStorageMock'
import {CookieConsentRepository} from '../../main/infrastructure/repository/CookieConsentRepository'
import {Status} from '../../main/domain/status/Status'
import {StatusRepository} from '../../main/domain/status/StatusRepository'
import {VendorListRepository} from '../../main/domain/vendorlist/VendorListRepository'
import {CookieStorage} from '../../main/infrastructure/repository/cookie/CookieStorage'

describe('AddEventListenerCommand Should', () => {
  const command = 'addEventListener'
  const version = 2

  function deleteAllCookies() {
    var cookies = window.document.cookie.split(';')

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i]
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
      window.document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }
  beforeEach(function() {
    deleteAllCookies()
  })
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
      const statusMock = {
        cmpStatus: Status.CMPSTATUS_LOADING
      }
      const statusRepositoryMock = {
        getStatus: () => statusMock
      }
      TestableTcfApiInitializer.create()
        .mock(CookieConsentRepository, cookieStorageMock)
        .mock(StatusRepository, statusRepositoryMock)
        .init()
        .saveUserConsent({
          vendor: {consents: {}, legitimateInterests: {}},
          purpose: {consents: {}, legitimateInterests: {}},
          specialFeatures: {}
        })

      window.__tcfapi(command, version, (TCData, success) => {
        expect(success).to.be.true
        expect(TCData.cmpStatus).equal(Status.CMPSTATUS_LOADING)
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
      const statusMock = {
        eventStatus: Status.TCLOADED,
        cmpStatus: Status.CMPSTATUS_LOADED
      }
      const statusRepositoryMock = {
        getStatus: () => statusMock
      }
      TestableTcfApiInitializer.create()
        .mock(StatusRepository, statusRepositoryMock)
        .init()

      window.__tcfapi(command, version, TCData => {
        expect(TCData.eventStatus).to.equal(Status.TCLOADED)
        expect(TCData.listenerId).exist
        done()
      })
    })

    it('When Display Status is VISIBLE should not be tcloaded', done => {
      const statusMock = {
        cmpStatus: Status.CMPSTATUS_LOADING,
        displayStatus: Status.DISPLAYSTATUS_VISIBLE
      }
      const statusRepositoryMock = {
        getStatus: () => statusMock
      }
      TestableTcfApiInitializer.create()
        .mock(StatusRepository, statusRepositoryMock)
        .init()

      window.__tcfapi(command, version, (TCData, status) => {
        expect(TCData.eventStatus).to.not.equal(Status.TCLOADED)
        expect(TCData.listenerId).exist
        done()
      })
    })
  })

  it('EventStatus should be tcloaded and will be raised at Init time when consent is valid', done => {
    let firstTime = true
    let tcloaded = false
    const callback = TCData => {
      if (firstTime) {
        expect(TCData.eventStatus).to.equal(null)
        expect(TCData.listenerId).exist
        firstTime = false
      } else {
        expect(TCData.eventStatus).to.equal(Status.TCLOADED)
        expect(TCData.listenerId).exist
        expect(TCData.cmpStatus).to.equal(Status.CMPSTATUS_LOADED)
        tcloaded = true
      }
    }
    const givenVendorList = {
      version: 44,
      policyVersion: 2
    }
    const vendorListRepository = {
      getVendorList: () => givenVendorList
    }
    const cookieStorageMock = new TestableCookieStorageMock()
    cookieStorageMock.save({
      data:
        'CO1mrN2O1mrN2CBADAENAsCAAAAAAAAAAAAAABEAAiAA.IGENV_T5eb2vj-3Zdt_tkaYwf55y3o-wzhheIs-8NyYeH7BoGP2MwvBX4JiQCGRgksiKBAQdtHGhcSQABgIhViTKMYk2MjzNKJLJAilsbO0NYCD9mnsHT3ZCY70--u__7P3fcAAA'
    })
    TestableTcfApiInitializer.create()
      .mock(VendorListRepository, vendorListRepository)
      .mock(CookieStorage, cookieStorageMock)
      .init()
    window.__tcfapi(command, version, callback)

    waitCondition({
      condition: () => tcloaded,
      timeoutMessage: 'callback Should be called',
      timeout: 2000
    })
      .then(() => {
        done()
      })
      .catch(error => {
        console.log('Error' + error)
      })
  })
  describe('tcloaded Scenarios', () => {
    it('EventStatus should be tcloaded when loadUserContent return  a valid consent', done => {
      const givenAcceptedAllPurpose = {
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
        9: true,
        10: true
      }
      const givenVendorAllDenied = {
        consents: {
          1: false,
          2: false
        },
        legitimateInterests: {
          1: false,
          2: false
        }
      }
      let firstTime = true
      let tcloaded = false
      const callback = TCData => {
        if (firstTime) {
          expect(TCData.eventStatus).to.equal(null)
          expect(TCData.listenerId).exist
          firstTime = false
        } else {
          expect(TCData.eventStatus).to.equal(Status.TCLOADED)
          expect(TCData.listenerId).exist
          expect(TCData.cmpStatus).to.equal(Status.CMPSTATUS_LOADED)
          tcloaded = true
        }
      }
      const givenVendorList = {
        policyVersion: 2,
        vendors: {
          1: {},
          2: {},
          3: {}
        }
      }
      const vendorListRepository = {
        getVendorList: () => givenVendorList
      }
      const cookieStorageMock = new TestableCookieStorageMock()
      const borosTcf = TestableTcfApiInitializer.create()
        .mock(VendorListRepository, vendorListRepository)
        .mock(CookieStorage, cookieStorageMock)
        .init()
      window.__tcfapi(command, version, callback)
      borosTcf
        .saveUserConsent({
          purpose: givenAcceptedAllPurpose,
          vendor: givenVendorAllDenied
        })
        .then(() => borosTcf.loadUserConsent({notify: true}))
        .then(consent => expect(consent.valid).to.be.true)
        .then(() =>
          waitCondition({
            condition: () => tcloaded,
            timeoutMessage: 'callback Should not be called',
            timeout: 1000
          })
        )
        .then(() => {
          done()
        })
    })
    it('EventStatus should Not be called when loadUserContent return  a NO valid consent', done => {
      let firstTime = true
      let tcloaded = false
      const callback = TCData => {
        if (firstTime) {
          expect(TCData.eventStatus).to.equal(undefined)
          expect(TCData.listenerId).exist
          firstTime = false
        } else {
          tcloaded = true
        }
      }

      const borosTcf = TestableTcfApiInitializer.create().init()
      window.__tcfapi(command, version, callback)
      borosTcf
        .loadUserConsent()
        .then(consent => expect(consent.valid).to.be.false)
        .then(() =>
          waitCondition({
            condition: () => tcloaded,
            timeoutMessage: 'Should not be called',
            timeout: 1000
          })
            .then(() => {
              done(new Error('Not expected resolution'))
            })
            .catch(error => {
              expect(error.message).to.be.equal('Should not be called')
              done()
            })
        )
    })
  })
  describe('cmpuishown Scenarios', () => {
    it('EventStatus should be cmpuishown when UI is surfaced', done => {
      const statusMock = {
        eventStatus: Status.TCLOADED,
        cmpStatus: Status.CMPSTATUS_LOADING,
        displayStatus: Status.DISPLAYSTATUS_VISIBLE
      }
      const statusRepositoryMock = {
        getStatus: () => statusMock
      }
      const borosTcf = TestableTcfApiInitializer.create()
        .mock(StatusRepository, statusRepositoryMock)
        .init()

      borosTcf.uiVisible({visible: true})
      window.__tcfapi(command, version, (TCData, success) => {
        expect(TCData.eventStatus).to.equal(Status.CMPUISHOWN)
        expect(TCData.listenerId).exist
        done()
      })
    })
  })
  describe('useractioncomplete Scenarios', () => {
    let borosTcf
    beforeEach(() => {
      const statusMock = {
        eventStatus: Status.TCLOADED,
        cmpStatus: Status.CMPSTATUS_LOADED
      }
      const statusRepositoryMock = {
        getStatus: () => statusMock
      }
      const cookieStorageMock = new TestableCookieStorageMock()

      borosTcf = TestableTcfApiInitializer.create()
        .mock(CookieConsentRepository, cookieStorageMock)
        .mock(StatusRepository, statusRepositoryMock)
        .init()
      borosTcf.saveUserConsent({
        vendor: {consents: {}, legitimateInterests: {}},
        purpose: {consents: {}, legitimateInterests: {}},
        specialFeatures: {}
      })
    })
    it('EventStatus should be tcloaded when user has confirmed o re confirmed their choices before registering', done => {
      borosTcf.uiVisible({visible: false})
      window.__tcfapi(command, version, TCData => {
        expect(TCData.eventStatus).to.equal(Status.USERACTIONCOMPLETE)
        expect(TCData.listenerId).exist
        done()
      })
    })
    it('EventStatus should be useractioncomplete when user has confirmed o re confirmed their choices after registering', done => {
      let firstTime = true
      const callback = TCData => {
        if (firstTime) {
          expect(TCData.eventStatus).to.equal(Status.TCLOADED)
          expect(TCData.listenerId).exist
          firstTime = false
        } else {
          expect(TCData.eventStatus).to.equal(Status.USERACTIONCOMPLETE)
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
    const statusRepository = {
      getStatus: () => ({
        cmpStatus: Status.CMPSTATUS_LOADED
      })
    }
    const borosTcf = TestableTcfApiInitializer.create()

      .mock(StatusRepository, statusRepository)
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
        expect(TCData.eventStatus).to.be.equal(Status.CMPUISHOWN)
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
