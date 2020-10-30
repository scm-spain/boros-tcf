import {iabGenerateConsent} from '../../testable/infrastructure/consent/IABConsentUtils'
import {IABConsentDecoderService} from '../../../main/infrastructure/service/IABConsentDecoderService'
import {COOKIE} from '../../fixtures/cookie'

describe.skip('IABConsentHelper', () => {
  it('generate a consent', async () => {
    console.log('>>> generating a consent')

    const givenVersionToEncodeConsent = 36
    const givenAcceptance = true

    const result = await iabGenerateConsent({
      latestVersion: givenVersionToEncodeConsent,
      acceptance: givenAcceptance
    })
    console.log('iabGenerateConsent', result)
    console.log('Encoded consent:')
    console.log(result.encodedConsent)
  })
  it('decode a consent', async () => {
    console.log('>>> decoding a consent')

    const givenConsent = COOKIE.V36_ALL_ACCEPTED

    const decoder = new IABConsentDecoderService()
    const result = decoder.decode({encodedConsent: givenConsent})
    console.log('Decoded consent:')
    console.log(result)
  })
})
