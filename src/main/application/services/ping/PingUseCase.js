import {inject} from '../../../core/ioc/ioc'
import {PingReturn} from '../../../domain/ping/PingReturn.js'
import {StatusRepository} from '../../../domain/status/StatusRepository'

export class PingUseCase {
  /**
   *
   * @param {Object} param
   * @param {StatusRepository} param.statusRepository
   */
  constructor({statusRepository = inject(StatusRepository)} = {}) {
    this._status = statusRepository.getStatus()
  }

  execute() {
    const pingReturn = new PingReturn({
      status: this._status
    })
    return pingReturn.value()
  }
}
