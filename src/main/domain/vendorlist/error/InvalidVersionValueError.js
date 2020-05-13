import {DomainError} from '../../error/DomainError'

class InvalidVersionValueError extends DomainError {
  constructor(versionValue) {
    super(`Invalid version [${versionValue}]`)
  }
}

export {InvalidVersionValueError}
