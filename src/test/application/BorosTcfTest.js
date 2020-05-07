import {BorosTcf} from '../../main/application/BorosTcf.js'
import sinon from 'sinon'
import {expect} from 'chai'

describe('BorosTcf should', () => {
  const getVendorListUseCase = {
    execute: () => null
  }
  const getConsentStatusUseCase = {
    execute: () => null
  }
  const loadUserConsentUseCase = {
    execute: () => null
  }
  const saveUserConsentUseCase = {
    execute: () => null
  }

  const borosTcf = new BorosTcf({
    getVendorListUseCase,
    getConsentStatusUseCase,
    loadUserConsentUseCase,
    saveUserConsentUseCase
  })

  it('getVendorList should delegate to getVendorListUseCase', () => {
    const getVendorListUseCaseSpy = sinon.spy(getVendorListUseCase, 'execute')

    borosTcf.getVendorList()
    expect(getVendorListUseCaseSpy.calledOnce).to.be.true
  })
  it('getConsentStatus should delegate to getConsentStatusUseCase', () => {
    const getConsentStatusUseCaseSpy = sinon.spy(
      getConsentStatusUseCase,
      'execute'
    )
    borosTcf.getConsentStatus()
    expect(getConsentStatusUseCaseSpy.calledOnce).to.be.true
  })
  it('loadUserConsent should delegate to loadUserConsentUseCase', () => {
    const loadUserConsentUseCaseSpy = sinon.spy(
      loadUserConsentUseCase,
      'execute'
    )
    borosTcf.loadUserConsent()
    expect(loadUserConsentUseCaseSpy.calledOnce).to.be.true
  })
  it('saveUserConsent should delegate to saveUserConsentUseCase and use Same Arguments', () => {
    const saveUserConsentUseCaseSpy = sinon.spy(
      saveUserConsentUseCase,
      'execute'
    )

    const givenPurposeVendor = {
      purpose: 'aPurpose',
      vendor: 'aVendor'
    }

    borosTcf.saveUserConsent(givenPurposeVendor)
    expect(saveUserConsentUseCaseSpy.calledOnce).to.be.true
    expect(saveUserConsentUseCaseSpy.getCall(0).args[0]).to.deep.equal(
      givenPurposeVendor
    )
  })
})
