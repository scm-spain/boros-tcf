/**
 * cmpStatus: CMP not yet loaded – stub still in place
 */
export const STUB = 'stub'
/**
 * cmpStatus: CMP is loading
 */
export const LOADING = 'loading'
/**
 * cmpStatus: CMP is finished loading
 */
export const LOADED = 'loaded'

/**
 * cmpStatus: CMP is in an error state.
 * A CMP shall not respond to any other API requests if this cmpStatus is present.
 * A CMP may set this status if, for any reason, it is unable to perform the operations
 * in compliance with the TCF.
 */
export const ERROR = 'error'

/**
 * displayStatus: User interface is currently displayed
 */
export const VISIBLE = 'visible'

/**
 * displayStatus: User interface is not yet or no longer displayed
 */
export const HIDDEN = 'hidden'

/**
 * displayStatus: User interface will not show
 * (e.g. GDPR does not apply or TC data is current and does not need renewal)
 */
export const DISABLED = 'disabled'
