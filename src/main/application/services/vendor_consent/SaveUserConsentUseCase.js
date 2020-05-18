import {ConsentRepository} from '../../../domain/consent/ConsentRepository'
import {inject} from '../../../core/ioc/ioc'

class SaveUserConsentUseCase {
  /**
   *
   * @param {ConsentRepository} consentRepository
   */
  constructor(consentRepository = inject(ConsentRepository)) {
    this._consentRepository = consentRepository
  }

  execute({purpose, vendor}) {
    const consent = JSON.stringify({purpose, vendor})
    this._consentRepository.saveUserConsent({consent})
  }
}

export {SaveUserConsentUseCase}
