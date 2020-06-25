export class VendorListHelper {
  haveAllValuesTo({object, valueToVerify}) {
    if (Object.entries(object).length === 0) {
      return valueToVerify === false
    }

    for (const [_, value] of Object.entries(object)) {
      if (valueToVerify !== value) {
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
    Object.entries(vendorList).forEach(([key, value]) => {
      newVendor.consents[key] = valueToSet
      newVendor.legitimateInterests[key] = valueToSet
    })
    return newVendor
  }

  mergeVendors({newVendorList, oldVendors}) {
    const mergedVendorList = {
      consents: {},
      legitimateInterests: {}
    }

    Object.entries(newVendorList).forEach(([key, value]) => {
      const intKey = parseInt(key)

      mergedVendorList.consents[intKey] =
        oldVendors.consents[intKey] !== undefined
          ? oldVendors.consents[intKey]
          : false
      mergedVendorList.legitimateInterests[intKey] =
        oldVendors.legitimateInterests[intKey] !== undefined
          ? oldVendors.legitimateInterests[intKey]
          : false
    })

    return mergedVendorList
  }
}
