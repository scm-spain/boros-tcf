import {VendorListHelper} from '../../../main/domain/vendorlist/VendorListHelper'
import {expect} from 'chai'

describe('VendorListHelper should', () => {
  const vendorListHelper = new VendorListHelper()
  describe('haveAllValuesTo should', () => {
    it('return true if vendor.consent is an empty object and we are asking for values to false', () => {
      const vendor = {
        consent: {}
      }
      const result = vendorListHelper.haveAllValuesTo({
        object: vendor.consent,
        valueToVerify: false
      })
      expect(result).to.be.true
    })
    it('return false if vendor.consent is an empty object and we are asking for values to true', () => {
      const vendor = {
        consent: {}
      }
      const result = vendorListHelper.haveAllValuesTo({
        object: vendor.consent,
        valueToVerify: true
      })
      expect(result).to.be.false
    })
    it('return true if vendor.consent has all consent to true and we are asking for values to true', () => {
      const vendor = {
        consent: {
          1: true,
          2: true
        }
      }
      const result = vendorListHelper.haveAllValuesTo({
        object: vendor.consent,
        valueToVerify: true
      })
      expect(result).to.be.true
    })
    it('return false if vendor.consent has any consent to false and we are asking for values to true', () => {
      const vendor = {
        consent: {
          1: true,
          2: false
        }
      }
      const result = vendorListHelper.haveAllValuesTo({
        object: vendor.consent,
        valueToVerify: true
      })
      expect(result).to.be.false
    })
    describe('setAllVendorsTo', () => {
      it('set all vendors to true', () => {
        const vendorList = {
          1: {},
          4: {}
        }
        const expectedVendorConsent = {
          consents: {
            1: true,
            4: true
          },
          legitimateInterests: {
            1: true,
            4: true
          }
        }
        const vendors = vendorListHelper.setAllVendorsTo({
          vendorList,
          valueToSet: true
        })
        expect(vendors).to.be.deep.equal(expectedVendorConsent)
      })
    })
    describe('mergeVendors', () => {
      it('all old vendors exists in new list, new ones set to false', () => {
        const oldVendors = {
          consents: {
            3: true,
            4: false
          },
          legitimateInterests: {
            3: false,
            4: true
          }
        }
        const newVendorList = {
          3: {},
          4: {},
          5: {},
          6: {}
        }
        const mergedVendors = vendorListHelper.mergeVendors({
          newVendorList,
          oldVendors
        })
        const expectedMergedVendors = {
          consents: {
            3: true,
            4: false,
            5: false,
            6: false
          },
          legitimateInterests: {
            3: false,
            4: true,
            5: false,
            6: false
          }
        }
        expect(mergedVendors).to.be.deep.equal(expectedMergedVendors)
      })
      it('one old vendors  does not exists in new list, new ones set to false', () => {
        const oldVendors = {
          consents: {
            3: true,
            4: false
          },
          legitimateInterests: {
            3: false,
            4: true
          }
        }
        const newVendorList = {
          4: {},
          5: {},
          6: {}
        }
        const mergedVendors = vendorListHelper.mergeVendors({
          newVendorList,
          oldVendors
        })
        const expectedMergedVendors = {
          consents: {
            4: false,
            5: false,
            6: false
          },
          legitimateInterests: {
            4: true,
            5: false,
            6: false
          }
        }
        expect(mergedVendors).to.be.deep.equal(expectedMergedVendors)
      })
    })
  })
})
