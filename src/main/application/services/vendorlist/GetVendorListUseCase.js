import {VendorListRepository} from '../../../domain/vendorlist/VendorListRepository'
import {inject} from '../../../core/ioc/ioc'

class GetVendorListUseCase {
  constructor({vendorListRepository = inject(VendorListRepository)} = {}) {
    this._vendorListRepository = vendorListRepository
  }

  execute({version, language}) {
    return this._vendorListRepository.getVendorList({version, language})
  }
}

export {GetVendorListUseCase}
