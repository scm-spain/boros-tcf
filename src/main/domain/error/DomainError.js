class DomainError extends Error {
  constructor(message, cause) {
    super()
    this.message = message + (cause ? ` [${cause.message}]` : '')
    this.name = this.constructor.name
    this.stack = new Error(this.message).stack
    this.cause = cause
  }
}

export {DomainError}
