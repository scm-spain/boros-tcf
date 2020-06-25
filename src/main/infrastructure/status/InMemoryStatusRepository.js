import {Status} from '../../domain/status/Status'
import {StatusRepository} from '../../domain/status/StatusRepository'

/**
 * @implements {StatusRepository}
 */
export class InMemoryStatusRepository extends StatusRepository {
  constructor() {
    super()
    this._status = new Status()
  }

  getStatus() {
    return this._status
  }
}
