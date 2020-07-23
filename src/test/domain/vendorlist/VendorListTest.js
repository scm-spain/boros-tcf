import {VendorList} from '../../../main/domain/vendorlist/VendorList'
import {expect} from 'chai'
describe('VendorList Should', () => {
  it('Create Empty Vendor List', () => {
    const policyVersion = 'aPolicyVersion'
    const version = 'aVersion'
    const value = {}
    const vendorList = new VendorList({policyVersion, version, value})
    expect(vendorList.policyVersion).equal(policyVersion)
    expect(vendorList.version).equal(version)
    expect(vendorList.value).equal(value)
  })
})
