import {DisplayStatusRepository} from '../../../domain/status/DisplayStatusRepository'
import {DisplayStatus} from '../../../domain/status/DisplayStatus'

/**
 * @implements {DisplayStatusRepository}
 */
export class InMemoryDisplayStatusRepository extends DisplayStatusRepository {
  constructor() {
    super()
    this._displayStatus = new DisplayStatus()
  }

  /**
   * @returns {DisplayStatus}
   */
  getDisplayStatus() {
    return this._displayStatus
  }

  setDisplayStatus({newStatus}) {
    this._displayStatus = newStatus
  }
}
