import {Status} from './Status'
import {StatusRepository} from './StatusRepository'

export class InMemoryStatusRepository extends StatusRepository {
  constructor() {
    super()
    this._status = new Status()
  }

  getStatus() {
    return this._status
  }
}