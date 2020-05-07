import {name, version} from '../../../package'

/**
 * Package Name
 */
export const PACKAGE_NAME = name

/**
 * Boros TCF Version is the current version.
 * It'll be the minor version as once developed, the IAB's TCF defined API should not change,
 * so major versions are useless to define this information value required by the PingReturn object.
 */
export const BOROS_TCF_VERSION = version.split('.')[1]

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
