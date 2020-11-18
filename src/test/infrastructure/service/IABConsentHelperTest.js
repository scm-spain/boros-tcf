import {iabGenerateConsent} from '../../testable/infrastructure/consent/IABConsentUtils'
import {IABConsentDecoderService} from '../../../main/infrastructure/service/IABConsentDecoderService'
import {COOKIE} from '../../fixtures/cookie'
import {TestableGVLFactory} from '../../testable/infrastructure/repository/iab/TestableGVLFactory'

describe.skip('IABConsentHelper', () => {
  it.skip('generate a consent', async () => {
    console.log('>>> generating a consent')

    const givenVersionToEncodeConsent = 36
    const givenAcceptance = true

    const givenVendorConsentsEdited = false
    const givenVendorLegitimateInterestsEdited = false

    const givenScope = {
      purposes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      specialFeatures: [1, 2]
    }

    const gvlFactory = new TestableGVLFactory({
      latestGvlVersion: givenVersionToEncodeConsent
    })
    const result = await iabGenerateConsent({
      gvlFactory,
      allPurposeConsents: givenAcceptance,
      allPurposeLegitimateInterests: givenAcceptance,
      allSpecialFeatures: givenAcceptance,
      allVendorConsents: givenAcceptance,
      allVendorLegitimateInterests: givenAcceptance,
      editedVendorConsents: givenVendorConsentsEdited,
      editedVendorLegitimateInterests: givenVendorLegitimateInterestsEdited,
      scope: givenScope
    })
    console.log('Encoded consent:')
    console.log(result.encodedConsent)
  })
  it('decode a consent', async () => {
    console.log('>>> decoding a consent')

    const givenConsent = COOKIE.OLDEST_GVL_ALL_ACCEPTED

    const decoder = new IABConsentDecoderService()
    const result = decoder.decode({encodedConsent: givenConsent})
    console.log('Decoded consent:')
    console.log(result)
  })
})
