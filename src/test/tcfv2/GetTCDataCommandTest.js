import jsdom from 'jsdom-global'
import {expect} from 'chai'
import {TestableTcfApiInitializer} from '../testable/infrastructure/bootstrap/TestableTcfApiInitializer'
import {TestableCookieStorageMock} from '../testable/infrastructure/repository/TestableCookieStorageMock'
import {COOKIE} from '../fixtures/cookie'
import {IABConsentDecoderService} from '../../main/infrastructure/service/IABConsentDecoderService'

describe('getTCData', () => {
  beforeEach(() => jsdom())
  const command = 'getTCData'
  const version = 2
  const givenCookie = COOKIE.V44_ALL_ACCEPTED

  it('should return all props correctly setted', done => {
    const cookieStorageMock = new TestableCookieStorageMock()

    cookieStorageMock.save({data: givenCookie})
    const decodedCookie = new IABConsentDecoderService().decode({
      encodedConsent: givenCookie
    })

    TestableTcfApiInitializer.create()
      .mock('euconsentCookieStorage', cookieStorageMock)
      .init()

    new Promise((resolve, reject) => {
      window.__tcfapi(command, version, (tcData, success) => {
        ;(success && resolve(tcData)) || reject(new Error('not succeed'))
      })
    })
      .then(tcData => {
        const {
          tcString,
          gdprApplies,
          purpose,
          vendor,
          specialFeatureOptins,
          publisher
        } = tcData
        expect(tcString).to.be.equal(givenCookie)
        expect(gdprApplies).to.be.true
        expect(purpose).to.deep.equal(decodedCookie.purpose)
        expect(vendor).to.deep.equal(decodedCookie.vendor)
        expect(specialFeatureOptins).to.deep.equal(
          decodedCookie.specialFeatures
        )
        expect(publisher).to.deep.equal(decodedCookie.publisher)
        done()
      })
      .catch(error => done(error))
  })
})
