import {inject} from '../../../core/ioc/ioc'
import {TCData} from '../../../domain/tcdata/TCData'
import {ConsentRepository} from '../../../domain/consent/ConsentRepository'
import {ConsentDecoderService} from '../../../domain/consent/ConsentDecoderService'
import {StatusRepository} from '../../../domain/status/StatusRepository'
import {ConsentFactory} from '../../../domain/consent/ConsentFactory'
export class GetTCDataUseCase {
  /**
   *
   * @param {Object} param
   * @param {StatusRepository} param.statusRepository
   */
  constructor({
    statusRepository = inject(StatusRepository),
    consentRepository = inject(ConsentRepository),
    consentDecoderService = inject(ConsentDecoderService),
    consentFactory = inject(ConsentFactory)
  } = {}) {
    this._statusRepository = statusRepository
    this._consentRepository = consentRepository
    this._consentDecoderService = consentDecoderService
    this._consentFactory = consentFactory
  }

  /**
   *
   * @param {Object} param
   * @param {Array<Number>} param.vendorIds
   */
  execute({vendorIds} = {}) {
    if (
      Array.isArray(vendorIds) &&
      vendorIds.some(
        vendorId =>
          typeof vendorId !== 'number' ||
          Number.isInteger(vendorId) ||
          vendorId < 1
      )
    ) {
      throw Error(
        'vendorIds parameter of getTCData has invalid data. It must be an array of positive integers, or undefined'
      )
    } else if (vendorIds !== undefined && !Array.isArray(vendorIds)) {
      throw Error(
        'vendorIds, if defined, needs to be an array of positive integers'
      )
    }
    const {cmpStatus, eventStatus} = this._statusRepository.getStatus()
    const encodedConsent = this._consentRepository.loadUserConsent()
    let tcModel
    if (encodedConsent) {
      tcModel = this._consentDecoderService.decode({encodedConsent})
    } else {
      tcModel = this._consentFactory.createEmpty().toJSON()
    }
    let vendor
    if (!vendorIds) {
      vendor = tcModel.vendor
    } else {
      vendor = {}
      Object.entries(tcModel.vendor).forEach(
        ([key, value]) => vendorIds.includes(key) && (vendor[key] = value)
      )
    }
    const tcData = new TCData({
      tcString: encodedConsent,
      tcModel: tcModel,
      cmpStatus: cmpStatus,
      eventStatus: eventStatus
    }).value()
    return tcData
  }
}
