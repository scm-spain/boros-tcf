import {
  BOROS_TCF_ID,
  BOROS_TCF_VERSION,
  TCF_API_SUPPORTED_VERSION,
  TCF_API_VERSION,
  PUBLISHER_CC
} from '../../core/constants'

export class TCData {
  /**
   *
   * @param {Object} param
   */
  constructor({
    tcString,
    cmpStatus,
    eventStatus,
    listenerId,
    publisher,
    purpose,
    vendor,
    specialFeatureOptins
  }) {
    this._tcString = tcString
    this._cmpStatus = cmpStatus
    this._eventStatus = eventStatus
    this._listenerId = listenerId
    this._publisher = publisher
    this._purpose = purpose
    this._vendor = vendor
    this._specialFeatureOptins = specialFeatureOptins
  }

  value() {
    return {
      tcString: this._tcString,
      tcfPolicyVersion: TCF_API_VERSION,
      cmpId: BOROS_TCF_ID,
      cmpVersion: BOROS_TCF_VERSION,

      /**
       * true - GDPR Applies
       * false - GDPR Does not apply
       * undefined - unknown whether GDPR Applies
       * see the section: "What does the gdprApplies value mean?"
       */
      gdprApplies: true,

      /*
       * see addEventListener command
       */
      eventStatus: this._eventStatus,

      /**
       * see Ping Status Codes in following table
       */
      cmpStatus: this._cmpStatus,

      /**
       * If this TCData is sent to the callback of addEventListener: number,
       * the unique ID assigned by the CMP to the listener function registered
       * via addEventListener.
       * Others: undefined.
       */
      listenerId: null,

      /*
       * true - if using a service-specific or publisher-specific TC String
       * false - if using a global TC String.
       */
      isServiceSpecific: false, // TODO: verify

      /**
       * true - CMP is using publisher-customized stack descriptions
       * false - CMP is NOT using publisher-customized stack descriptions
       */
      useNonStandardStacks: false, // TODO: verify

      /**
       * Country code of the country that determines the legislation of
       * reference.  Normally corresponds to the country code of the country
       * in which the publisher's business entity is established.
       */
      publisherCC: PUBLISHER_CC,

      /**
       * Only exists on service-specific TC
       *
       * true - Purpose 1 not disclosed at all. CMPs use PublisherCC to
       * indicate the publisher's country of establishment to help Vendors
       * determine whether the vendor requires Purpose 1 consent.
       *
       * false - There is no special Purpose 1 treatment status. Purpose 1 was
       * disclosed normally (consent) as expected by TCF Policy
       */
      // purposeOneTreatment: false, // TODO: verify

      /**
       * Only exists on global-scope TC
       */
      outOfBand: {
        /**
         * true - Vendor is allowed to use an Out-of-Band Legal Basis
         * false | undefined - Vendor is NOT allowed to use an Out-of-Band Legal Basis
         */
        // '[vendor id]': Boolean
        allowedVendors: {},
        /**
         * true - Vendor has been disclosed to the user
         * false | undefined - Vendor has been disclosed to the user
         */
        // '[vendor id]': Boolean
        disclosedVendors: {}
      },
      purpose: this._purpose,
      vendor: this._vendor,
      specialFeatureOptins: this._specialFeatureOptins,
      publisher: this._publisher
    }
  }
}
