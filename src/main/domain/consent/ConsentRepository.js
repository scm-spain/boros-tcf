/**
 * @interface
 */
class ConsentRepository {
  /**
   *
   * @param {array<number>} purpose
   * @param vendor
   */
  saveUserConsent({consent}) {}
}

export {ConsentRepository}
