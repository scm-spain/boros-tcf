import {inject} from '../../../core/ioc/ioc'
import {ConsentRepository} from '../../../domain/consent/ConsentRepository'
import {ConsentEncoderService} from '../../../domain/consent/ConsentEncoderService'
import {ConsentFactory} from '../../../domain/consent/ConsentFactory'

class SaveUserConsentUseCase {
  /**
   * @param {ConsentEncoderService} consentEncoderService
   * @param {ConsentRepository} consentRepository
   */
  constructor({
    consentEncoderService = inject(ConsentEncoderService),
    consentRepository = inject(ConsentRepository),
    consentFactory = inject(ConsentFactory)
  } = {}) {
    this._consentEncoderService = consentEncoderService
    this._consentRepository = consentRepository
    this._consentFactory = consentFactory
  }

  async execute({purpose, vendor, specialFeatures}) {
    const previousEncodedConsent = this._consentRepository.loadUserConsent()
    const incomingConsent = this._consentFactory.createConsent({
      vendor,
      purpose,
      specialFeatures
    })
    const consent = await this._consentEncoderService.encode({
      consent: incomingConsent,
      previousEncodedConsent
    })
    this._consentRepository.saveUserConsent({consent})
  }
}

export {SaveUserConsentUseCase}
