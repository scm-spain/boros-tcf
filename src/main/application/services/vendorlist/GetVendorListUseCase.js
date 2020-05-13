import {VendorListRepository} from '../../../domain/vendorlist/VendorListRepository'
import {inject} from '../../../core/ioc/ioc'
import {Version} from '../../../domain/vendorlist/Version'
import {Language} from '../../../domain/vendorlist/Language'

class GetVendorListUseCase {
  constructor({vendorListRepository = inject(VendorListRepository)} = {}) {
    this._vendorListRepository = vendorListRepository
  }

  execute({vendorListVersion, translationLanguage}) {
    const version = new Version(vendorListVersion)
    const language = new Language(translationLanguage)
    return this._vendorListRepository
      .getVendorList({version, language})
      .then(vendorList => vendorList.value)
  }
}

export {GetVendorListUseCase}
