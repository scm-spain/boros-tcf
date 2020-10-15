import {VendorListRepository} from '../../../domain/vendorlist/VendorListRepository'
import {inject} from '../../../core/ioc/ioc'
import {Version} from '../../../domain/vendorlist/Version'
import {AsyncUseCase} from '../AsyncUseCase'

export class GetVendorListUseCase extends AsyncUseCase {
  constructor({vendorListRepository = inject(VendorListRepository)} = {}) {
    super()
    this._vendorListRepository = vendorListRepository
  }

  execute({vendorListVersion}) {
    const version = new Version(vendorListVersion)
    return this._vendorListRepository
      .getVendorList({version})
      .then(vendorList => vendorList.value)
  }
}

GetVendorListUseCase.ID = 'GetVendorListUseCase'
