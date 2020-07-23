import {VendorListRepository} from '../../../domain/vendorlist/VendorListRepository'
import {inject} from '../../../core/ioc/ioc'
import {Version} from '../../../domain/vendorlist/Version'

class GetVendorListUseCase {
  constructor({vendorListRepository = inject(VendorListRepository)} = {}) {
    this._vendorListRepository = vendorListRepository
  }

  execute({vendorListVersion}) {
    const version = new Version(vendorListVersion)
    return this._vendorListRepository
      .getVendorList({version})
      .then(vendorList => vendorList.value)
  }
}

export {GetVendorListUseCase}
