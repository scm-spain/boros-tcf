import {inject} from '../../core/ioc/ioc'
import {Consent} from './Consent'
import {ConsentDecoderService} from '../../domain/consent/ConsentDecoderService'
import {ConsentEncoderService} from '../../domain/consent/ConsentEncoderService'

const emptyVendorPurpose = () => ({consents: {}, legitimateInterests: {}})

export class ConsentFactory {
  constructor({
    consentDecoderService = inject(ConsentDecoderService),
    consentEncoderService = inject(ConsentEncoderService)
  } = {}) {
    this._consentDecoderService = consentDecoderService
    this._consentEncoderService = consentEncoderService
  }

  async createEmptyConsent() {
    const encodedValue = await this._consentEncoderService.encode()
    const decodedValue = this._consentDecoderService.decode({
      encodedConsent: encodedValue
    })
    return new Consent({...decodedValue, isNew: true})
  }

  createConsent({vendor, purpose, specialFeatures, valid, isNew}) {
    return new Consent({
      vendor,
      purpose,
      specialFeatures,
      valid,
      isNew
    })
  }

  createEmpty = () =>
    new Consent({
      vendor: emptyVendorPurpose(),
      purpose: emptyVendorPurpose(),
      specialFeatures: {},
      valid: false,
      isNew: false
    })
}
