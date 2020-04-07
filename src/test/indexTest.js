import {expect} from 'chai'

describe('index', () => {
  it('should export the API and the Stub', () => {
    const index = require('../main')
    expect(index.BorosTcfApi).to.not.undefined
    expect(index.BorosTcfStub).to.not.undefined
  })
})
