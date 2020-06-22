/* eslint-disable no-undef */
/**
 * Package Name
 */
export const PACKAGE_NAME = __PACKAGE_NAME__

/**
 * Boros TCF Version is the current version.
 * It'll be the minor version as once developed, the IAB's TCF defined API should not change,
 * so major versions are useless to define this information value required by the PingReturn object.
 */
export const BOROS_TCF_VERSION = __PACKAGE_MINOR_VERSION__

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
export const VENDOR_LIST_DEFAULT_LANGUAGE = 'en'

/**
 * Vendor List version to be requested to get the latest remote resource
 */
export const VENDOR_LIST_LATEST_VERSION = 'LATEST'

/**
 * Base endpoint to get access to remote Vendor List resources
 */
export const VENDOR_LIST_ENDPOINT = 'https://a.dcdn.es/borostcf/v2/vendorlist'

/**
 * Country code of the country that determines the legislation of
 * reference.  Normally corresponds to the country code of the country
 * in which the publisher's business entity is established.
 */
export const PUBLISHER_CC = 'es'
