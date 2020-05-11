import {VendorListRepository} from '../../domain/vendorlist/VendorListRepository'
import {inject} from '../../core/ioc/ioc'
import {HttpClient} from './http/HttpClient'
import {VendorList} from '../../domain/vendorlist/VendorList'

class HttpVendorListRepository extends VendorListRepository {
  constructor({httpClient = inject(HttpClient)} = {}) {
    super()
    this._httpClient = httpClient
  }

  getVendorList({version, language}) {
    const versionPath = version ? `/${version}` : ''
    const queryString = language ? `?language=${language}` : ''
    const url = `${VENDOR_LIST_ENDPOINT}${versionPath}${queryString}`
    return this._httpClient
      .get({url})
      .then(response => response.data)
      .then(
        value =>
          new VendorList({
            version: value.vendorListVersion,
            language: language || DEFAULT_VENDOR_LIST_VALUE_LANGUAGE,
            value
          })
      )
  }
}

const VENDOR_LIST_ENDPOINT = 'https://a.dcdn.es/borostcf/v2/vendorlist'
const DEFAULT_VENDOR_LIST_VALUE_LANGUAGE = 'en'

export {HttpVendorListRepository}
