import {CmpStatusRepository} from '../../../domain/status/CmpStatusRepository'
import {CmpStatus} from '../../../domain/status/CmpStatus'

/**
 * @implements {CmpStatusRepository}
 */
export class InMemoryCmpStatusRepository extends CmpStatusRepository {
  constructor() {
    super()
    this._cmpStatus = new CmpStatus()
  }

  /**
   * @returns {CmpStatus}
   */
  getCmpStatus() {
    return this._cmpStatus
  }

  setCmpStatus({newCmpStatus}) {
    this._cmpStatus = newCmpStatus
  }
}
