/**
 * @interface
 */
class ConsentRepository {
  loadUserConsent() {}
  saveUserConsent({encodedConsent, decodedConsent}) {}
}

export {ConsentRepository}
