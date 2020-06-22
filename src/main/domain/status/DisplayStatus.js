export class DisplayStatus {
  /**
   * displayStatus: User interface is currently displayed
   */
  static VISIBLE = 'visible'

  /**
   * displayStatus: User interface is not yet or no longer displayed
   */
  static HIDDEN = 'hidden'

  /**
   * displayStatus: User interface will not show
   * (e.g. GDPR does not apply or TC data is current and does not need renewal)
   */
  static DISABLED = 'disabled'

  constructor({status = DisplayStatus.DISABLED} = {}) {
    this._status = status
  }

  /**
   * @returns {String}
   */
  get code() {
    return this._status
  }

  set code(statusCode) {
    this._status = statusCode
  }
}
