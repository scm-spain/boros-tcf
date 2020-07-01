import {VendorListRepository} from '../../../domain/vendorlist/VendorListRepository'
import {VendorList} from '../../../domain/vendorlist/VendorList'
import {inject} from '../../../core/ioc/ioc'
import {GVLFactory} from './GVLFactory'
import {Language} from '../../../domain/vendorlist/Language'

export class IABVendorListRepository extends VendorListRepository {
  constructor({gvlFactory = inject(GVLFactory)} = {}) {
    super()
    this._gvlFactory = gvlFactory
  }

  async getVendorList({version, language = new Language('en')} = {}) {
    const gvl = await this._gvlFactory.createWith({
      version: version?.value,
      language: language?.value
    })
    await gvl.readyPromise
    const vendorListJson = gvl.getJson()
    return new VendorList({
      policyVersion: vendorListJson.tcfPolicyVersion,
      version: vendorListJson.vendorListVersion,
      value: vendorListJson
    })
  }
}
