import {inject} from '../../core/ioc/ioc'
import {ConsentRepository} from '../consent/ConsentRepository'
import {Consentfactory} from '../consent/Consentfactory'
import {ConsentDecoderService} from '../consent/ConsentDecoderService'

export class LoadConsentService {
  constructor({
    consentRepository = inject(ConsentRepository),
    consentfactory = inject(Consentfactory),
    consentDecoderService = inject(ConsentDecoderService)
  } = {}) {
    this._consentRepository = consentRepository
    this._consentfactory = consentfactory
    this._consentDecoderService = consentDecoderService
  }

  loadConsent() {
    const encodedConsent = this._consentRepository.loadUserConsent()
    if (!encodedConsent) {
      return this._consentfactory.createEmptyConsent()
    }
    return this._consentDecoderService.decode({encodedConsent})
  }
}
