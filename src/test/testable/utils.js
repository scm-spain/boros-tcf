import {expect} from 'chai'

const consentWithoutDynamicValues = consent => {
  const {cmpVersion, created, lastUpdated, ...rest} = consent
  return rest
}

export const equalConsentsValidation = (a, b) =>
  expect(consentWithoutDynamicValues(a)).to.deep.equal(
    consentWithoutDynamicValues(b)
  )
