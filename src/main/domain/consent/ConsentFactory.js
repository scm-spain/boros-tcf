import {inject} from '../../core/ioc/ioc'
import {Consent} from './Consent'
import {ConsentDecoderService} from '../../domain/consent/ConsentDecoderService'
import {ConsentEncoderService} from '../../domain/consent/ConsentEncoderService'

export class ConsentFactory {
  constructor({
    consentDecoderService = inject(ConsentDecoderService),
    consentEncoderService = inject(ConsentEncoderService)
  } = {}) {
    this._consentDecoderService = consentDecoderService
    this._consentEncoderService = consentEncoderService
  }

  createEmptyConsent() {
    const encodedValue = this._consentEncoderService.encode()
    return new Consent(this._consentDecoderService(encodedValue))
  }

  createConsent({vendor, purpose, specialFeatures}) {
    return new Consent({
      vendor,
      purpose,
      specialFeatures,
      valid: true
    })
  }
}
