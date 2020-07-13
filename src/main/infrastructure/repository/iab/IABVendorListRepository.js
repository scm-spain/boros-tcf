import {VendorListRepository} from '../../../domain/vendorlist/VendorListRepository'
import {VendorList} from '../../../domain/vendorlist/VendorList'
import {inject} from '../../../core/ioc/ioc'
import {GVLFactory} from './GVLFactory'

export class IABVendorListRepository extends VendorListRepository {
  constructor({gvlFactory = inject(GVLFactory)} = {}) {
    super()
    this._gvlFactory = gvlFactory
  }

  async getVendorList({version} = {}) {
    const gvl = await this._gvlFactory.create({
      version: version?.value
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
