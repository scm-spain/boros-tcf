import {expect} from 'chai'
import {ConsentFactory} from '../../../main/domain/consent/ConsentFactory'
import {GVLFactory} from '../../../main/infrastructure/repository/iab/GVLFactory'
import {IABConsentEncoderService} from '../../../main/infrastructure/service/IABConsentEncoderService'
import {IABConsentDecoderService} from '../../../main/infrastructure/service/IABConsentDecoderService'
describe('Consent Factory Should', () => {
  const consentEncoderService = new IABConsentEncoderService({
    gvlFactory: new GVLFactory()
  })
  const consentDecoderService = new IABConsentDecoderService()
  it('Create Empty consent', async () => {
    const consentFactory = new ConsentFactory({
      consentEncoderService,
      consentDecoderService
    })
    const expectedConsent = {
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
