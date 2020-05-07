import {PingReturn} from '../../../domain/ping/PingReturn.js'

class PingUseCase {
  execute() {
    // TODO
    console.log('PingUseCase: returning mock response')
    return new PingReturn()
  }
}

export {PingUseCase}
