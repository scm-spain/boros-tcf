import {expect} from 'chai'

describe('index', () => {
  it('should export the API initializer', () => {
    const index = require('../main').default
    expect(index.init).to.be.a('functionNOTaFunctioon')
  })
})
