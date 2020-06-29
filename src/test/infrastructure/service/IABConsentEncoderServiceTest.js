import {IABConsentEncoderService} from '../../../main/infrastructure/service/IABConsentEncoderService'
import {expect} from 'chai'
import {IABConsentDecoderService} from '../../../main/infrastructure/service/IABConsentDecoderService'
import {GVLFactory} from '../../../main/infrastructure/repository/iab/GVLFactory'
describe('IABConsentEncoderService Should', () => {
  const iabConsentDecoderService = new IABConsentDecoderService()
  const iabConsentEncoderService = new IABConsentEncoderService({
    gvlFactory: new GVLFactory()
  })
  it('encode and decode String and the result should be the same object', async () => {
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
  describe('Detailed scenarios', () => {
    describe('When a purpose is accepted should', () => {
      const consent = {
        policyVersion: 2,
        purpose: {
          consents: {
            1: true
          },
          legitimateInterests: {
            1: true
          }
        },
        specialFeatures: {}
      }
      it('Scenario 1: vendor consent IS ACCEPTED AND vendor legitimateInterest IS ACCEPTED', async () => {
        consent.vendor = {
          consents: {
            3: true
          },
          legitimateInterests: {
            3: true
          }
        }
        const encodedConsent = await iabConsentEncoderService.encode({consent})
        const decoded = iabConsentDecoderService.decode({encodedConsent})
        expect(decoded.purpose.consents[1]).equal(true)
        expect(decoded.vendor.consents[3]).equal(true)
        expect(decoded.vendor.legitimateInterests[3]).equal(true)
      })
      it('Scenario 2: vendor consent IS REFUSED BUT vendor legitimateInterest IS ACCEPTED', async () => {
        consent.vendor = {
          consents: {
            3: false
          },
          legitimateInterests: {
            3: true
          }
        }
        const encodedConsent = await iabConsentEncoderService.encode({consent})
        const decoded = iabConsentDecoderService.decode({encodedConsent})
        expect(decoded.purpose.consents[1]).equal(true)
        expect(decoded.vendor.consents).deep.equal({})
        expect(decoded.vendor.legitimateInterests[3]).equal(true)
      })
      it('Scenario 3: vendor consent is ACCEPTED  BUT  vendor legitimateInterest IS REFUSED', async () => {
        consent.vendor = {
          consents: {
            3: true
          },
          legitimateInterests: {
            3: false
          }
        }
        const encodedConsent = await iabConsentEncoderService.encode({consent})
        const decoded = iabConsentDecoderService.decode({encodedConsent})
        expect(decoded.purpose.consents[1]).equal(true)
        expect(decoded.vendor.consents[3]).equal(true)
        expect(decoded.vendor.legitimateInterests).deep.equal({})
      })
    })
    describe('When a purpose is REFUSED should', () => {
      const consent = {
        policyVersion: 2,
        purpose: {
          consents: {
            1: false
          },
          legitimateInterests: {
            1: false
          }
        },
        specialFeatures: {}
      }
      it('Scenario 4: vendor consent is REFUSED AND vendor legitimateInterest IS REFUSED', async () => {
        consent.vendor = {
          consents: {
            3: false
          },
          legitimateInterests: {
            3: false
          }
        }
        const encodedConsent = await iabConsentEncoderService.encode({consent})
        const decoded = iabConsentDecoderService.decode({encodedConsent})
        expect(decoded.purpose.consents).deep.equal({})
        expect(decoded.vendor.consents).deep.equal({})
        expect(decoded.vendor.legitimateInterests).deep.equal({})
      })
      it('Scenario 5: vendor consent is REFUSED  BUT vendor legitimateInterest IS ACCEPTED', async () => {
        consent.vendor = {
          consents: {
            3: false
          },
          legitimateInterests: {
            3: true
          }
        }
        const encodedConsent = await iabConsentEncoderService.encode({consent})
        const decoded = iabConsentDecoderService.decode({encodedConsent})
        expect(decoded.purpose.consents).deep.equal({})
        expect(decoded.vendor.consents).deep.equal({})
        expect(decoded.vendor.legitimateInterests[3]).equal(true)
      })
      it('Scenario 6: vendor consent is ACCEPTED BUT vendor legitimateInterest IS REFUSED', async () => {
        consent.vendor = {
          consents: {
            3: true
          },
          legitimateInterests: {
            3: false
          }
        }
        const encodedConsent = await iabConsentEncoderService.encode({consent})
        const decoded = iabConsentDecoderService.decode({encodedConsent})
        expect(decoded.purpose.consents).deep.equal({})
        expect(decoded.vendor.consents[3]).equal(true)
        expect(decoded.vendor.legitimateInterests).deep.equal({})
      })
    })
  })
})
