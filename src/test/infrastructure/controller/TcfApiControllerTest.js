/* eslint-disable no-template-curly-in-string */
import {TestableTcfApiInitializer} from '../../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {expect} from 'chai'
import itParam from 'mocha-param'

describe('TcfApiController should', () => {
  describe('version behaviour', () => {
    const commandList = [
      'addEventListener',
      'removeEventListener',
      'getTCData',
      'getVendorList'
    ]
    const commandListOk = commandList.filter(
      item => item !== 'removeEventListener'
    )

    itParam(
      'for command ${value} If the version is 2, callback shall be invoked with  true for the success parameter and TC data parameter should be returned',
      commandListOk,
      async value => {
        TestableTcfApiInitializer.create().init()
        const {tcData, success} = await new Promise(resolve =>
          window.__tcfapi(value, 2, (tcData, success) => {
            resolve({tcData, success})
          })
        )
        expect(tcData.tcfPolicyVersion).equal(2)
        expect(success).equal(
          true,
          'Success should be true for command: ' + value
        )
      }
    )
    itParam(
      'for command ${value}, If the version is 1, callback shall be invoked with  false for the success parameter and a null argument for TC data parameter',
      commandList,
      async value => {
        TestableTcfApiInitializer.create().init()
        const {tcData, success} = await new Promise(resolve =>
          window.__tcfapi(value, 1, (tcData, success) => {
            resolve({tcData, success})
          })
        )
        expect(tcData).equal(null)
        expect(success).equal(
          false,
          'Success should be false for command: ' + value
        )
      }
    )
    itParam(
      'for command ${value}, If the argument is 0 (Zero), shall return the information for the latest (highest) version available',
      commandListOk,
      async value => {
        TestableTcfApiInitializer.create().init()
        const {tcData, success} = await new Promise(resolve =>
          window.__tcfapi(value, 0, (tcData, success) => {
            resolve({tcData, success})
          })
        )
        expect(tcData.tcfPolicyVersion).equal(
          2,
          'version  should be 2 for command: ' + value
        )
        expect(success).equal(
          true,
          'Success should be true for command: ' + value
        )
      }
    )
    itParam(
      'for command ${value}, If the argument is null, shall return the information for the latest (highest) version available',
      commandListOk,
      async value => {
        TestableTcfApiInitializer.create().init()
        const {tcData, success} = await new Promise(resolve =>
          window.__tcfapi(value, null, (tcData, success) => {
            resolve({tcData, success})
          })
        )
        expect(tcData.tcfPolicyVersion).equal(2)
        expect(success).equal(
          true,
          'Success should be true for command: ' + value
        )
      }
    )
    itParam(
      'for command ${value}, If the argument undefined shall return the information for the latest (highest) version available',
      commandListOk,
      async value => {
        TestableTcfApiInitializer.create().init()
        const {tcData, success} = await new Promise(resolve =>
          window.__tcfapi(value, undefined, (tcData, success) => {
            resolve({tcData, success})
          })
        )
        expect(tcData.tcfPolicyVersion).equal(2)
        expect(success).equal(
          true,
          'Success should be true for command: ' + value
        )
      }
    )
  })
})
