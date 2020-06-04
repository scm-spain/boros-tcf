/**
 * @interface
 */
class ConsentEncoderService {
  encode({vendor, purpose, specialFeatures, previousEncodedConsent}) {}
}

export {ConsentEncoderService}
