import {expect} from 'chai'
import {Consent} from '../../../main/domain/consent/Consent'
describe('Consent should', () => {
  it('Create valid and isNew to default values', () => {
    const vendor = {}
    const purpose = {}
    const specialFeatures = {}
    const consent = new Consent({vendor, purpose, specialFeatures})
    expect(consent.isNew).to.be.false
    expect(consent.valid).to.be.false
    expect(consent.purpose).to.be.deep.equal(purpose)
    expect(consent.specialFeatures).to.be.deep.equal(specialFeatures)
    expect(consent.vendor).to.be.deep.equal(vendor)
  })
})
