import {expect} from 'chai'
import {IABConsentDecoderService} from '../../../main/infrastructure/service/IABConsentDecoderService'
import {COOKIE} from '../../fixtures/cookie'
import {OLDEST_GVL_VERSION} from '../../testable/infrastructure/repository/iab/TestableGVLFactory'
//
// Examples from https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20Consent%20string%20and%20vendor%20list%20formats%20v2.md
//
describe('IABConsentDecoderService Should', () => {
  it('Should decode an Content String may optionally contain a Publisher TC', () => {
    const iabConsentDecoderService = new IABConsentDecoderService()
    const encodedConsent = COOKIE.OLDEST_GVL_ALL_ACCEPTED
    const consent = iabConsentDecoderService.decode({encodedConsent})

    expect(consent.vendorListVersion).equal(OLDEST_GVL_VERSION)
    expect(consent.policyVersion).equal(2)
    expect(consent.vendor.consents).exist
    expect(consent.vendor.legitimateInterests).exist
    expect(consent.purpose.consents).exist
    expect(consent.purpose.legitimateInterests).exist
    expect(consent.specialFeatures).exist
  })
})
