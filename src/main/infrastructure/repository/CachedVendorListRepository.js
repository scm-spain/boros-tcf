import {VendorListRepository} from '../../domain/vendorlist/VendorListRepository'

class CachedVendorListRepository extends VendorListRepository {
  constructor({vendorListRepository}) {
    super()
    this._sourceRepository = vendorListRepository
    this._cached = new Map()
  }

  getVendorList({version, language}) {
    const key = this._key({version, language})
    if (!this._cached.has(key)) {
      this._cached.set(
        key,
        this._sourceRepository.getVendorList({version, language})
      )
    }
    return this._cached.get(key)
  }

  _key({version, language}) {
    return `${version.value}-${language.value}`
  }
}

export {CachedVendorListRepository}
