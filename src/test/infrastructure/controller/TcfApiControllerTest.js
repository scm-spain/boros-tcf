import {TestableTcfApiInitializer} from '../../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {expect} from 'chai'
describe('TcfApiController should', () => {
  describe('version behaviour', () => {
    const command = 'addEventListener'
    it('If the version is 2, callback shall be invoked with  true for the success parameter and TC data parameter should be returned', async () => {
      TestableTcfApiInitializer.create().init()
      const {tcData, success} = await new Promise(resolve =>
        window.__tcfapi(command, 2, (tcData, success) => {
          resolve({tcData, success})
        })
      )
      expect(tcData).exist
      expect(success).equal(true)
    })
    it('If the version is 1, callback shall be invoked with  false for the success parameter and a null argument for TC data parameter', async () => {
      TestableTcfApiInitializer.create().init()
      const {tcData, success} = await new Promise(resolve =>
        window.__tcfapi(command, 1, (tcData, success) => {
          resolve({tcData, success})
        })
      )
      expect(tcData).equal(null)
      expect(success).equal(false)
    })
    it('If the argument is 0 (Zero), shall return the information for the latest (highest) version available', async () => {
      TestableTcfApiInitializer.create().init()
      const {tcData, success} = await new Promise(resolve =>
        window.__tcfapi(command, 0, (tcData, success) => {
          resolve({tcData, success})
        })
      )
      expect(tcData).exist
      expect(success).equal(true)
    })
    it('If the argument is null, shall return the information for the latest (highest) version available', async () => {
      TestableTcfApiInitializer.create().init()
      const {tcData, success} = await new Promise(resolve =>
        window.__tcfapi(command, null, (tcData, success) => {
          resolve({tcData, success})
        })
      )
      expect(tcData).exist
      expect(success).equal(true)
    })
    it('If the argument undefined shall return the information for the latest (highest) version available', async () => {
      TestableTcfApiInitializer.create().init()
      const {tcData, success} = await new Promise(resolve =>
        window.__tcfapi(command, undefined, (tcData, success) => {
          resolve({tcData, success})
        })
      )
      expect(tcData).exist
      expect(success).equal(true)
    })
  })
})
