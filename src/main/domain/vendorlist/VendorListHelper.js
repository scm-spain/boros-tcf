export class VendorListHelper {
  haveAllValuesTo({object, valueToVerify, oldVendorList}) {
    if (Object.entries(object).length === 0) {
      return valueToVerify === false
    }
    for (const [key, value] of Object.entries(object)) {
      if (valueToVerify !== value && oldVendorList && oldVendorList[key]) {
        return false
      }
    }
    return true
  }

  setAllVendorsTo({vendorList, valueToSet}) {
    const newVendor = {
      consents: {},
      legitimateInterests: {}
    }
    if (vendorList) {
      Object.keys(vendorList).forEach(key => {
        newVendor.consents[key] = valueToSet
        newVendor.legitimateInterests[key] = valueToSet
      })
    }
    return newVendor
  }

  mergeVendors({newVendorList, oldVendors}) {
    const mergedVendorList = {
      consents: {},
      legitimateInterests: {}
    }

    Object.keys(newVendorList).forEach(key => {
      mergedVendorList.consents[key] =
        oldVendors.consents[key] !== undefined
          ? oldVendors.consents[key]
          : false
      mergedVendorList.legitimateInterests[key] =
        oldVendors.legitimateInterests[key] !== undefined
          ? oldVendors.legitimateInterests[key]
          : false
    })

    return mergedVendorList
  }
}
