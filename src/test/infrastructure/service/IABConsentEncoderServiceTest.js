import {IABConsentEncoderService} from '../../../main/infrastructure/service/IABConsentEncoderService'
import {expect} from 'chai'
import {IABConsentDecoderService} from '../../../main/infrastructure/service/IABConsentDecoderService'
import {GVLFactory} from '../../../main/infrastructure/repository/iab/GVLFactory'
describe('IABConsentEncoderService Should', () => {
  it('encode and decode String and the result should be the same object', async () => {
    const iabConsentDecoderService = new IABConsentDecoderService()
    const iabConsentEncoderService = new IABConsentEncoderService({
      gvlFactory: new GVLFactory()
    })
    const consent = {
      policyVersion: 2,
      vendor: {
        consents: {
          1: true,
          2: true
        },
        legitimateInterests: {
          1: false,
          2: true
        }
      },
      purpose: {
        consents: {
          1: true,
          2: true
        },
        legitimateInterests: {
          1: false,
          2: true
        }
      },
      specialFeatures: {}
    }
    const encodedConsent = await iabConsentEncoderService.encode({consent})
    const decoded = iabConsentDecoderService.decode({encodedConsent})
    expect(consent.vendor.consents).to.be.deep.equal(decoded.vendor.consents)
    expect(consent.vendor.legitimateInterests).to.be.deep.equal(
      decoded.vendor.legitimateInterests
    )
    expect(consent.purpose.consents).to.be.deep.equal(decoded.purpose.consents)
    expect(consent.purpose.legitimateInterests).to.be.deep.equal(
      decoded.purpose.legitimateInterests
    )
    expect(consent.policyVersion).equal(decoded.policyVersion)
  })
})
