import {inject} from '../../../core/ioc/ioc'
import {CmpStatusRepository} from '../../../domain/status/CmpStatusRepository'
import {DisplayStatusRepository} from '../../../domain/status/DisplayStatusRepository'
import {TCData} from '../../../domain/tcdata/TCData'
import {ConsentRepository} from '../../../domain/consent/ConsentRepository'
import {EventStatusService} from '../../../domain/service/EventStatusService'
import {ConsentDecoderService} from '../../../domain/consent/ConsentDecoderService'
export class GetTCDataUseCase {
  /**
   *
   * @param {Object} param
   * @param {CmpStatusRepository} param.cmpStatusRepository
   * @param {DisplayStatusRepository} param.displayStatusRepository
   */
  constructor({
    cmpStatusRepository = inject(CmpStatusRepository),
    displayStatusRepository = inject(DisplayStatusRepository),
    consentRepository = inject(ConsentRepository),
    eventStatusService = inject(EventStatusService),
    consentDecoderService = inject(ConsentDecoderService)
  } = {}) {
    this._cmpStatusRepository = cmpStatusRepository
    this._displayStatusRepository = displayStatusRepository
    this._consentRepository = consentRepository
    this._eventStatusService = eventStatusService
    this._consentDecoderService = consentDecoderService
  }

  /**
   *
   * @param {Object} param
   * @param {Array<Number>} param.vendorIds
   */
  execute({vendorIds}) {
    const cmpStatus = this._cmpStatusRepository.getCmpStatus()
    const eventStatus = this._eventStatusService.getEventStatus()
    const encodedConsent = this._consentRepository.loadUserConsent()
    const tcModel = this._consentDecoderService.decode({encodedConsent})

    const {publisher, purpose, specialFeature} = tcModel
    let vendor
    if (!vendorIds) {
      vendor = tcModel.vendor
    } else {
      vendor = {}
      Object.entries(tcModel.vendor).forEach(
        ([key, value]) => vendorIds.includes(key) && (vendor[key] = value)
      )
    }

    return new TCData({
      tcString: encodedConsent,
      cmpStatus: cmpStatus,
      eventStatus: eventStatus,
      publisher,
      purpose,
      vendor,
      specialFeatureOptins: specialFeature
    })
  }
}
