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

  /**
   * @returns {String}
   */
  get code() {
    return DisplayStatus.HIDDEN
  }
}
