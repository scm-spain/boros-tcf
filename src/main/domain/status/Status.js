import {inject} from '../../core/ioc/ioc'
import {ConsentRepository} from '../consent/ConsentRepository'
import {ConsentDecoderService} from '../consent/ConsentDecoderService'
import {DomainEventBus} from '../service/DomainEventBus'
import {EVENT_STATUS_CHANGED} from '../../core/constants'

export class Status {
  /**
   * cmpStatus: CMP not yet loaded – stub still in place
   */
  static CMPSTATUS_STUB = 'stub'

  /**
   * cmpStatus: CMP is loading
   */
  static CMPSTATUS_LOADING = 'loading'

  /**
   * cmpStatus: CMP is finished loading
   */
  static CMPSTATUS_LOADED = 'loaded'

  /**
   * cmpStatus: CMP is in an error state.
   * A CMP shall not respond to any other API requests if this cmpStatus is present.
   * A CMP may set this status if, for any reason, it is unable to perform the operations
   * in compliance with the TCF.
   */
  static CMPSTATUS_ERROR = 'error'

  /**
   * displayStatus: User interface is currently displayed
   */
  static DISPLAYSTATUS_VISIBLE = 'visible'

  /**
   * displayStatus: User interface is not yet or no longer displayed
   */
  static DISPLAYSTATUS_HIDDEN = 'hidden'

  /**
   * displayStatus: User interface will not show
   * (e.g. GDPR does not apply or TC data is current and does not need renewal)
   */
  static DISPLAYSTATUS_DISABLED = 'disabled'

  static USERACTIONCOMPLETE = 'useractioncomplete'
  static CMPUISHOWN = 'cmpuishown'
  static TCLOADED = 'tcloaded'

  /**
   *
   * @param {Object} param
   * @param {DomainEventBus} param.domainEventBus
   * @param {ConsentRepository} param.consentRepository
   * @param {ConsentDecoderService} param.consentDecoderService
   */
  constructor({
    domainEventBus = inject(DomainEventBus),
    consentRepository = inject(ConsentRepository),
    consentDecoderService = inject(ConsentDecoderService)
  } = {}) {
    this._domainEventBus = domainEventBus
    this._consentRepository = consentRepository
    this._consentDecoderService = consentDecoderService
    this._cmpStatus = Status.CMPSTATUS_LOADING
    this._displayStatus = Status.DISPLAYSTATUS_DISABLED
    this._eventStatus = null
  }

  /**
   * @returns {Boolean}
   */
  get loaded() {
    return true
  }

  /**
   * @returns {String}
   */
  get cmpStatus() {
    return this._cmpStatus
  }

  set cmpStatus(cmpStatus) {
    const oldValue = this._cmpStatus
    this._cmpStatus = cmpStatus
    this._domainEventBus.raise({
      eventName: EVENT_STATUS_CHANGED,
      payload: {
        status: VALUE_CMP_STATUS,
        oldValue,
        newValue: cmpStatus
      }
    })
  }

  get displayStatus() {
    return this._displayStatus
  }

  set displayStatus(displayStatus) {
    const oldValue = this._displayStatus
    this._displayStatus = displayStatus
    this._domainEventBus.raise({
      eventName: EVENT_STATUS_CHANGED,
      payload: {
        status: VALUE_DISPLAY_STATUS,
        oldValue,
        newValue: displayStatus
      }
    })
  }

  get eventStatus() {
    return this._eventStatus
  }

  set eventStatus(eventStatus) {
    const oldValue = this._eventStatus
    this._eventStatus = eventStatus
    this._domainEventBus.raise({
      eventName: EVENT_STATUS_CHANGED,
      payload: {
        status: VALUE_EVENT_STATUS,
        oldValue,
        newValue: eventStatus
      }
    })
  }

  /**
   * Returns gvlVersion. undefined if no consent
   *
   * @readonly
   * @returns {Number | undefined}
   */
  get gvlVersion() {
    const encodedConsent = this._consentRepository.loadUserConsent()
    if (!encodedConsent) {
      return undefined
    }
    const decodedConsent = this._consentDecoderService.decode({encodedConsent})
    return decodedConsent.vendorListVersion
  }
}

const VALUE_CMP_STATUS = 'cmp'
const VALUE_EVENT_STATUS = 'event'
const VALUE_DISPLAY_STATUS = 'ui'
