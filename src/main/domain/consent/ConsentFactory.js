import {inject} from '../../core/ioc/ioc'
import {Consent} from './Consent'
import {ConsentDecoderService} from '../../domain/consent/ConsentDecoderService'
import {ConsentEncoderService} from '../../domain/consent/ConsentEncoderService'

const emptyVendorPurpose = () => ({consents: {}, legitimateInterests: {}})

export class ConsentFactory {
  constructor({
    scope,
    consentDecoderService = inject(ConsentDecoderService),
    consentEncoderService = inject(ConsentEncoderService)
  } = {}) {
    this._scope = scope
    this._consentDecoderService = consentDecoderService
    this._consentEncoderService = consentEncoderService
  }

  async createEmptyConsent() {
    const encodedValue = await this._consentEncoderService.encode()
    const decodedValue = this._consentDecoderService.decode({
      encodedConsent: encodedValue
    })
    return new Consent({...decodedValue, isNew: true, scope: this._scope})
  }

  createConsent(initialData) {
    return new Consent({...initialData, scope: this._scope})
  }

  createEmpty = () =>
    new Consent({
      vendor: emptyVendorPurpose(),
      purpose: emptyVendorPurpose(),
      specialFeatures: {},
      valid: false,
      isNew: true,
      scope: this._scope
    })
}
