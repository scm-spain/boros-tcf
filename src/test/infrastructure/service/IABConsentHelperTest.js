import {iabEncodeConsent} from '../../testable/infrastructure/consent/IABEncodeConsent'
import {IABConsentDecoderService} from '../../../main/infrastructure/service/IABConsentDecoderService'
import {COOKIE} from '../../fixtures/cookie'

describe.skip('IABConsentHelper', () => {
  it('encode a consent with all accepted', async () => {
    const givenVersionToEncodeConsent = 36
    const givenAcceptance = true

    const result = await iabEncodeConsent({
      latestVersion: givenVersionToEncodeConsent,
      acceptance: givenAcceptance
    })
    console.log('iabEncodeConsent', result)
    console.log('Encoded consent:')
    console.log(result.encodedConsent)
  })
})
