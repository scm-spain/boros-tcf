import {DomainEventBus} from '../../../main/domain/service/DomainEventBus'
import {expect} from 'chai'
import sinon from 'sinon'
import {waitCondition} from '../../../main/core/service/waitCondition'
import {Observable} from '../../../main/domain/service/Observable'
describe('DomainEventBus Should', () => {
  const observableFactory = {
    create: ({observer}) => new Observable({id: Math.random(), observer})
  }

  const firstEventName = 'firstEventName'
  const secondEventName = 'secondEventName'
  const firstObserver = () => null
  const secondObserver = () => null

  describe('getNumberOfRegisteredEvents', () => {
    it('return zero for getNumberOfRegisteredEvents when is created', () => {
      const domainEventBus = new DomainEventBus({observableFactory})
      expect(domainEventBus.getNumberOfRegisteredEvents).to.be.equal(0)
    })
    it('return two for getNumberOfRegisteredEvents when two different events are registered', () => {
      const domainEventBus = new DomainEventBus({observableFactory})

      domainEventBus.register({
        eventName: firstEventName,
        observer: firstObserver
      })
      domainEventBus.register({
        eventName: secondEventName,
        observer: secondObserver
      })
      expect(domainEventBus.getNumberOfRegisteredEvents).to.be.equal(2)
    })
    it('return one for getNumberOfRegisteredEvents when the same  event is  registered twice', () => {
      const domainEventBus = new DomainEventBus({observableFactory})

      domainEventBus.register({
        eventName: firstEventName,
        observer: firstObserver
      })
      domainEventBus.register({
        eventName: firstEventName,
        observer: secondObserver
      })
      expect(domainEventBus.getNumberOfRegisteredEvents).to.be.equal(1)
    })
  })
  describe('getNumberOfObserversRegisteredForAnEvent and register', () => {
    it('return zero for getNumberOfObserversRegisteredForAnEvent when is created', () => {
      const domainEventBus = new DomainEventBus({observableFactory})
      expect(
        domainEventBus.getNumberOfObserversRegisteredForAnEvent({
          eventName: firstEventName
        })
      ).to.be.equal(0)
    })
    it('return one for each event  when two different events are registered', () => {
      const domainEventBus = new DomainEventBus({observableFactory})

      domainEventBus.register({
        eventName: firstEventName,
        observer: firstObserver
      })
      domainEventBus.register({
        eventName: secondEventName,
        observer: secondObserver
      })
      expect(
        domainEventBus.getNumberOfObserversRegisteredForAnEvent({
          eventName: firstEventName
        })
      ).to.be.equal(1)
      expect(
        domainEventBus.getNumberOfObserversRegisteredForAnEvent({
          eventName: secondEventName
        })
      ).to.be.equal(1)
    })
    it('return two for an event  when two different observers are registered to the same event', () => {
      const domainEventBus = new DomainEventBus({observableFactory})

      domainEventBus.register({
        eventName: firstEventName,
        observer: firstObserver
      })
      domainEventBus.register({
        eventName: firstEventName,
        observer: secondObserver
      })
      expect(
        domainEventBus.getNumberOfObserversRegisteredForAnEvent({
          eventName: firstEventName
        })
      ).to.be.equal(2)
    })
  })
  describe('raise', () => {
    it('when we rise an event without observers, should not crash ', done => {
      const domainEventBus = new DomainEventBus({observableFactory})
      Promise.resolve()
        .then(() => domainEventBus.raise({eventName: 'unexistingEvent'}))
        .then(() => done())
    })
    it('call all observers once when raise is called', () => {
      const domainEventBus = new DomainEventBus({observableFactory})
      const spyFirstObserver = sinon.spy(firstObserver)
      const spySecondObserver = sinon.spy(secondObserver)
      domainEventBus.register({
        eventName: firstEventName,
        observer: spyFirstObserver
      })
      domainEventBus.register({
        eventName: firstEventName,
        observer: spySecondObserver
      })
      domainEventBus.raise({eventName: firstEventName})
      return waitCondition({
        condition: () =>
          spyFirstObserver.calledOnce && spySecondObserver.calledOnce,
        timeout: 1000
      })
    })
    it('call only the observers for the specific event when raise is called', done => {
      const domainEventBus = new DomainEventBus({observableFactory})
      const spyFirstObserver = sinon.spy(firstObserver)
      const spySecondObserver = sinon.spy(secondObserver)
      domainEventBus.register({
        eventName: firstEventName,
        observer: spyFirstObserver
      })
      domainEventBus.register({
        eventName: secondEventName,
        observer: spySecondObserver
      })
      domainEventBus.raise({eventName: firstEventName})

      waitCondition({
        condition: () => spyFirstObserver.calledOnce,
        timeout: 1000
      }).then(() => {
        waitCondition({
          condition: () => spySecondObserver.calledOnce,
          timeout: 1000,
          timeoutMessage: 'secondObserverShouldNotBeCalled'
        })
          .then(() => done(new Error('Second observer should not be called')))
          .catch(error => {
            expect(error.message).to.be.equal('secondObserverShouldNotBeCalled')
            done()
          })
      })
    })
    it('if first observer throw an exception, second observer should be called when raise is called', () => {
      const firstObseverThrowException = () => {
        throw new Error('Error')
      }

      const domainEventBus = new DomainEventBus({observableFactory})
      const spyFirstObserver = sinon.spy(firstObseverThrowException)
      const spySecondObserver = sinon.spy(secondObserver)
      domainEventBus.register({
        eventName: firstEventName,
        observer: spyFirstObserver
      })
      domainEventBus.register({
        eventName: firstEventName,
        observer: spySecondObserver
      })
      domainEventBus.raise({eventName: firstEventName})
      return waitCondition({
        condition: () =>
          spyFirstObserver.calledOnce && spySecondObserver.calledOnce,
        timeout: 1000
      })
    })
  })
  describe('getNumberOfRegisteredEvents and unregister', () => {
    it('after unregister getNumberOfRegisteredEvents should decrease', () => {
      const domainEventBus = new DomainEventBus({observableFactory})
      const reference = domainEventBus.register({
        eventName: firstEventName,
        observer: firstObserver
      })
      domainEventBus.unregister({
        eventName: firstEventName,
        reference
      })
      expect(domainEventBus.getNumberOfRegisteredEvents).to.be.equal(0)
    })
    it('after unregister an event that has not been registered should  not crash', () => {
      const domainEventBus = new DomainEventBus({observableFactory})
      domainEventBus.unregister({
        eventName: firstEventName,
        reference: null
      })
      expect(domainEventBus.getNumberOfRegisteredEvents).to.be.equal(0)
    })
  })
  describe('getNumberOfObserversRegisteredForAnEvent and unregister', done => {
    it('after unregister getNumberOfObserversRegisteredForAnEvent should decrease', () => {
      const domainEventBus = new DomainEventBus({observableFactory})
      const reference = domainEventBus.register({
        eventName: firstEventName,
        observer: firstObserver
      })
      domainEventBus.register({
        eventName: firstEventName,
        observer: secondObserver
      })
      domainEventBus.unregister({
        eventName: firstEventName,
        reference
      })
      expect(
        domainEventBus.getNumberOfObserversRegisteredForAnEvent({
          eventName: firstEventName
        })
      ).to.be.equal(1)
    })
  })
  describe('raise and unregister', () => {
    it('call all observer except the unregistered one', done => {
      const spyFirstObserver = sinon.spy(firstObserver)
      const spySecondObserver = sinon.spy(secondObserver)
      const domainEventBus = new DomainEventBus({observableFactory})
      const reference = domainEventBus.register({
        eventName: firstEventName,
        observer: spyFirstObserver
      })
      domainEventBus.register({
        eventName: firstEventName,
        observer: spySecondObserver
      })
      domainEventBus.unregister({eventName: firstEventName, reference})
      domainEventBus.raise({eventName: firstEventName})

      waitCondition({
        condition: () => spySecondObserver.callCount === 1,
        timeout: 500
      }).then(() =>
        waitCondition({
          condition: () => spyFirstObserver.callCount === 1,
          timeout: 500,
          timeoutMessage: 'firstObserverShouldNotBeCalled'
        }).catch(error => {
          expect(error.message).to.be.equal('firstObserverShouldNotBeCalled')
          done()
        })
      )
    })
  })
  describe('unregister', () => {
    it('when unregister and un existent event return false', () => {
      const domainEventBus = new DomainEventBus({observableFactory})
      const success = domainEventBus.unregister({
        eventName: 'unexitingEvent'
      })
      expect(success).to.be.false
    })
    it('when unregister and an event that exists but reference is not found, then return false', () => {
      const domainEventBus = new DomainEventBus({observableFactory})
      domainEventBus.register({
        eventName: firstEventName,
        observer: firstObserver
      })
      const success = domainEventBus.unregister({
        eventName: firstEventName,
        reference: 'unexistingReference'
      })
      expect(success).to.be.false
    })
    it('when unregister and an event that  exists and reference is  found, then return true', () => {
      const domainEventBus = new DomainEventBus({observableFactory})
      const reference = domainEventBus.register({
        eventName: firstEventName,
        observer: firstObserver
      })
      const success = domainEventBus.unregister({
        eventName: firstEventName,
        reference
      })
      expect(success).to.be.true
    })
  })
  describe('register', () => {
    it('Should fail if observer is not a function', done => {
      try {
        const domainEventBus = new DomainEventBus({observableFactory})
        domainEventBus.register({eventName: 'givenEvent', observer: {}})
        done(new Error('Should fail'))
      } catch (error) {
        done()
      }
    })
  })
  describe('raise', () => {
    it('Should execute observer callback using the raised payload', done => {
      const givenEventName = 'givenEventName'
      const domainEvent = {
        eventName: givenEventName,
        payload: 'domainEvent payload'
      }
      const observerSpy = sinon.spy()
      const domainEventBus = new DomainEventBus({
        observableFactory
      })
      const res = domainEventBus.register({
        eventName: givenEventName,
        observer: observerSpy
      })

      const expectedEvent = {
        eventName: domainEvent.eventName,
        payload: domainEvent.payload
      }

      expect(res).to.exist
      domainEventBus.raise(domainEvent)

      waitCondition({condition: () => observerSpy.calledOnce}).then(() => {
        expect(observerSpy.getCall(0).args[0]).to.deep.equal(expectedEvent)
        expect(domainEventBus.getNumberOfRegisteredEvents).equal(1)
        done()
      })
    })
  })
})
