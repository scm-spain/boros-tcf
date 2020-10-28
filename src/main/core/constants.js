/* eslint-disable no-undef */
/**
 * Package Name
 */
export const PACKAGE_NAME =
  (typeof __PACKAGE_NAME__ !== 'undefined' && __PACKAGE_NAME__) || 'boros-tcf'

/**
 * Boros TCF Version is the current version.
 * It'll be the minor version as once developed, the IAB's TCF defined API should not change,
 * so major versions are useless to define this information value required by the PingReturn object.
 */
export const BOROS_TCF_VERSION =
  (typeof __PACKAGE_MINOR_VERSION__ !== 'undefined' &&
    __PACKAGE_MINOR_VERSION__) ||
  1

/**
 * Boros TCF IAB's registered ID
 */
export const BOROS_TCF_ID = 129

/**
 * TCF API version supported as number
 */
export const TCF_API_VERSION = 2

/**
 * TCF API version supported as string
 */
export const TCF_API_SUPPORTED_VERSION = '2.0'

/**
 * Vendor List language if no translation is requested for the remote resource
 */
export const VENDOR_LIST_DEFAULT_LANGUAGE = 'es'

/**
 * Vendor List version to be requested to get the latest remote resource
 */
export const VENDOR_LIST_LATEST_VERSION = 'LATEST'

/**
 * Base endpoint to get access to remote Vendor List resources
 */
export const VENDOR_LIST_ENDPOINT =
  'https://ms-adit--operations-gateway.spain.advgo.net/borostcf/v2/vendorlist'

/**
 * Country code of the country that determines the legislation of
 * reference.  Normally corresponds to the country code of the country
 * in which the publisher's business entity is established.
 */
export const PUBLISHER_CC = 'ES'

/**
 * Encoded consent cookie name
 */
export const VENDOR_CONSENT_COOKIE_NAME = 'euconsent-v2'

/**
 * Decoded consent cookie name
 */
export const BOROS_CONSENT_COOKIE_NAME = 'borosTcf'

/**
 * Cookies max age
 */
export const VENDOR_CONSENT_COOKIE_MAX_AGE = 33696000

/**
 * Cookies default path
 */
export const VENDOR_CONSENT_COOKIE_DEFAULT_PATH = '/'

/**
 * Cookies same site local value
 */
export const VENDOR_CONSENT_COOKIE_SAME_SITE_LOCAL_VALUE = 'Lax'

/**
 * Event raised when event listener execution fails
 */
export const EVENT_LISTENER_ERROR = 'LISTENER_ERROR'

/**
 * Event raised any time a use case has finished its execution correctly
 */
export const EVENT_USE_CASE_CALLED = 'USE_CASE_CALLED'

/**
 * Event raised any time a use case ends with error
 */
export const EVENT_USE_CASE_ERROR = 'USE_CASE_ERROR'

/**
 * Event raised any time the consent is requested but its loading fails for any reason and an empty consent is returned
 */
export const EVENT_LOAD_CONSENT_ERROR = 'LOAD_CONSENT_ERROR'
