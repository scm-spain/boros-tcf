import {VendorList} from '../../../main/domain/vendorlist/VendorList'
import {expect} from 'chai'
describe('VendorList Should', () => {
  it('Create Empty Vendor List', () => {
    const policyVersion = 'aPolicyVersion'
    const version = 'aVersion'
    const language = 'es'
    const value = {}
    const vendorList = new VendorList({policyVersion, language, version, value})
    expect(vendorList.policyVersion).equal(policyVersion)
    expect(vendorList.language).equal(language)
    expect(vendorList.version).equal(version)
    expect(vendorList.value).equal(value)
  })
})
