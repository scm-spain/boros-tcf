import {inject} from '../../../core/ioc/ioc'
import {ConsentRepository} from '../../../domain/consent/ConsentRepository'
import {ConsentEncoderService} from '../../../domain/consent/ConsentEncoderService'

class SaveUserConsentUseCase {
  /**
   * @param {ConsentEncoderService} consentEncoderService
   * @param {ConsentRepository} consentRepository
   */
  constructor({
    consentEncoderService = inject(ConsentEncoderService),
    consentRepository = inject(ConsentRepository)
  } = {}) {
    this._consentEncoderService = consentEncoderService
    this._consentRepository = consentRepository
  }

  async execute({purpose, vendor}) {
    const consent = await this._consentEncoderService.encode({purpose, vendor})
    this._consentRepository.saveUserConsent({consent})
  }
}

export {SaveUserConsentUseCase}
