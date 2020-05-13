import {VendorListRepository} from '../../domain/vendorlist/VendorListRepository'
import {inject} from '../../core/ioc/ioc'
import {HttpClient} from './http/HttpClient'
import {VendorList} from '../../domain/vendorlist/VendorList'
import {
  VENDOR_LIST_DEFAULT_LANGUAGE,
  VENDOR_LIST_ENDPOINT
} from '../../core/constants'

class HttpVendorListRepository extends VendorListRepository {
  constructor({httpClient = inject(HttpClient)} = {}) {
    super()
    this._httpClient = httpClient
  }

  /**
   * @param {Version} version
   * @param {Language} language
   * @returns {PromiseLike<VendorList>}
   */
  getVendorList({version, language}) {
    const url = `${VENDOR_LIST_ENDPOINT}/${version.value}?language=${language.value}`
    return this._httpClient
      .get({url})
      .then(response => response.data)
      .then(
        value =>
          new VendorList({
            version: value.vendorListVersion,
            language: language || VENDOR_LIST_DEFAULT_LANGUAGE,
            value
          })
      )
  }
}

export {HttpVendorListRepository}
