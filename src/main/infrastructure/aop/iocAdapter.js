import {VendorListRepository} from '../../domain/vendorlist/VendorListRepository'
import {CachedVendorListRepository} from '../repository/CachedVendorListRepository'

export const iocAdapter = (instance, key) => {
  switch (key) {
    case VendorListRepository:
      return new CachedVendorListRepository({vendorListRepository: instance})
    default:
      return instance
  }
}
