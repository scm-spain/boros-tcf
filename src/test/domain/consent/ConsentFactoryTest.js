import {expect} from 'chai'
import {ConsentFactory} from '../../../main/domain/consent/ConsentFactory'
import {IABConsentEncoderService} from '../../../main/infrastructure/service/IABConsentEncoderService'
import {IABConsentDecoderService} from '../../../main/infrastructure/service/IABConsentDecoderService'
import {
  BOROS_TCF_ID,
  BOROS_TCF_VERSION,
  PUBLISHER_CC,
  TCF_API_VERSION
} from '../../../main/core/constants'
import {
  OLDEST_GVL_VERSION,
  TestableGVLFactory
} from '../../testable/infrastructure/repository/iab/TestableGVLFactory'

describe('Consent Factory Should', () => {
  it('Create Empty consent', async () => {
    const consentEncoderService = new IABConsentEncoderService({
      gvlFactory: new TestableGVLFactory({latestGvlVersion: OLDEST_GVL_VERSION})
    })
    const consentDecoderService = new IABConsentDecoderService()
    const consentFactory = new ConsentFactory({
      consentEncoderService,
      consentDecoderService
    })
    const expectedConsent = {
      cmpId: BOROS_TCF_ID,
      cmpVersion: BOROS_TCF_VERSION,
      policyVersion: TCF_API_VERSION,
      vendorListVersion: OLDEST_GVL_VERSION,
      publisherCC: PUBLISHER_CC,
      isServiceSpecific: true,
      useNonStandardStacks: false,
      purposeOneTreatment: false,
      vendor: {
        consents: {},
        legitimateInterests: {}
      },
      purpose: {
        consents: {},
        legitimateInterests: {}
      },
      specialFeatures: {},
      publisher: {
        consents: {},
        customPurpose: {
          consents: {},
          legitimateInterests: {}
        },
        legitimateInterests: {},
        restrictions: {}
      },
      valid: false,
      isNew: true
    }

    const consent = await consentFactory.createEmptyConsent()
    const consentDto = consent.toJSON()
    expect(consentDto).deep.equal(expectedConsent)
  })
})
