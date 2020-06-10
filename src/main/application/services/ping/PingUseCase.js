import {inject} from '../../../core/ioc/ioc'
import {PingReturn} from '../../../domain/ping/PingReturn.js'
import {CmpStatusRepository} from '../../../domain/status/CmpStatusRepository'
import {DisplayStatusRepository} from '../../../domain/status/DisplayStatusRepository'

export class PingUseCase {
  /**
   *
   * @param {Object} param
   * @param {CmpStatusRepository} param.cmpStatusRepository
   * @param {DisplayStatusRepository} param.displayStatusRepository
   */
  constructor({
    cmpStatusRepository = inject(CmpStatusRepository),
    displayStatusRepository = inject(DisplayStatusRepository)
  } = {}) {
    this._cmpStatusRepository = cmpStatusRepository
    this._displayStatusRepository = displayStatusRepository
  }

  execute() {
    return new PingReturn({cmpStatus: this._cmpStatusRepository.getCmpStatus()})
  }
}
