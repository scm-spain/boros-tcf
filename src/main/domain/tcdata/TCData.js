import {
  BOROS_TCF_ID,
  BOROS_TCF_VERSION,
  TCF_API_VERSION,
  PUBLISHER_CC
} from '../../core/constants'

export class TCData {
  /**
   *
   * @param {Object} param
   */
  constructor({tcString, tcModel, cmpStatus, eventStatus, listenerId}) {
    this._tcString = tcString
    this._tcModel = tcModel
    this._cmpStatus = cmpStatus
    this._eventStatus = eventStatus
    this._listenerId = listenerId
  }

  value() {
    return {
      tcString: this._tcString,
      tcfPolicyVersion: this._tcModel.tcfPolicyVersion,
      cmpId: this._tcModel.cmpId,
      cmpVersion: this._tcModel.cmpVersion,

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
      isServiceSpecific: this._tcModel.isServiceSpecific,

      /**
       * true - CMP is using publisher-customized stack descriptions
       * false - CMP is NOT using publisher-customized stack descriptions
       */
      useNonStandardStacks: this._tcModel.useNonStandardStacks,

      /**
       * Country code of the country that determines the legislation of
       * reference.  Normally corresponds to the country code of the country
       * in which the publisher's business entity is established.
       */
      publisherCC: this._tcModel.publisherCC,

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
      purposeOneTreatment: this._tcModel.purposeOneTreatment,
      purpose: this._tcModel.purpose,
      vendor: this._tcModel.vendor,
      specialFeatureOptins: this._tcModel.specialFeatureOptins,
      publisher: this._tcModel.publisher
    }
  }
}
