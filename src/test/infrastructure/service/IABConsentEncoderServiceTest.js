import {IABConsentEncoderService} from '../../../main/infrastructure/service/IABConsentEncoderService'
import {expect} from 'chai'
import {
  LATEST_VERSION,
  TestableGVLFactory
} from '../../testable/infrastructure/repository/iab/TestableGVLFactory'
import {COOKIE} from '../../fixtures/cookie'
import {iabDecodeConsent} from '../../testable/infrastructure/consent/IABConsentUtils'

describe('IABConsentEncoderService', () => {
  const givenLatestGvlVersion = LATEST_VERSION
  let iabConsentEncoderService

  beforeEach(() => {
    iabConsentEncoderService = new IABConsentEncoderService({
      gvlFactory: new TestableGVLFactory({latestVersion: givenLatestGvlVersion})
    })
  })

  describe('given a consent to encode', () => {
    it('should encode a consent generating a valid IAB tcString value', async () => {
      const expectedEncodedConsent = COOKIE.V44_ALL_ACCEPTED
      const expectedDecodedConsent = iabDecodeConsent({
        encodedConsent: expectedEncodedConsent
      })
      const {purpose, specialFeatures, vendor} = expectedDecodedConsent

      const givenConsent = {purpose, specialFeatures, vendor}
      const encodedConsent = await iabConsentEncoderService.encode({
        consent: givenConsent
      })
      const decodedConsent = iabDecodeConsent({encodedConsent})
      expect(decodedConsent).to.deep.equal(expectedDecodedConsent)
    })
  })

  describe('given no consent to encode', () => {
    it('should encode an empty consent generating a valid IAB tcString value', async () => {
      const expectedEncodedConsent = COOKIE.V44_NOTHING_ACCEPTED
      const expectedDecodedConsent = iabDecodeConsent({
        encodedConsent: expectedEncodedConsent
      })

      const encodedConsent = await iabConsentEncoderService.encode()
      const decodedConsent = iabDecodeConsent({encodedConsent})
      expect(decodedConsent).to.deep.equal(expectedDecodedConsent)
    })
  })
})
