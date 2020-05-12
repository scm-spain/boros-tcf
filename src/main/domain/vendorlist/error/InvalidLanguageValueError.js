import {DomainError} from '../../error/DomainError'

class InvalidLanguageValueError extends DomainError {
  constructor(languageValue) {
    super(`Invalid language [${languageValue}]`)
  }
}

export {InvalidLanguageValueError}
