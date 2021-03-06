import {inject} from '../../../core/ioc/ioc'
import {ConsentRepository} from '../../../domain/consent/ConsentRepository'
import {ConsentEncoderService} from '../../../domain/consent/ConsentEncoderService'
import {ConsentFactory} from '../../../domain/consent/ConsentFactory'
import {AsyncUseCase} from '../AsyncUseCase'

export class SaveUserConsentUseCase extends AsyncUseCase {
  /**
   * @param {ConsentEncoderService} consentEncoderService
   * @param {ConsentRepository} consentRepository
   * @param {ConsentFactory} consentFactory
   */
  constructor({
    consentEncoderService = inject(ConsentEncoderService),
    consentRepository = inject(ConsentRepository),
    consentFactory = inject(ConsentFactory)
  } = {}) {
    super()
    this._consentEncoderService = consentEncoderService
    this._consentRepository = consentRepository
    this._consentFactory = consentFactory
  }

  async execute({purpose, vendor, specialFeatures}) {
    const incomingConsent = this._consentFactory.createConsent({
      vendor,
      purpose,
      specialFeatures
    })
    const consent = await this._consentEncoderService.encode({
      consent: incomingConsent
    })
    this._consentRepository.saveUserConsent({
      encodedConsent: consent,
      decodedConsent: incomingConsent
    })
  }
}

SaveUserConsentUseCase.ID = 'SaveUserConsentUseCase'
