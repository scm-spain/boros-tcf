import {HttpClient} from '../../../../main/infrastructure/repository/http/HttpClient'

class TestableHttpClientMock extends HttpClient {
  constructor() {
    super()
    this._requests = []
    this._resolver = request =>
      Promise.reject(new Error('Unresolved request: ' + request))
  }

  get(getRequest) {
    this._requests.push(getRequest)
    return Promise.resolve().then(() => this._resolver(getRequest))
  }

  setResolver(resolver) {
    if (typeof resolver !== 'function') {
      throw new Error('TestableHttpClientMock resolver must be a function')
    }
    this._resolver = resolver
  }

  get requests() {
    return this._requests
  }
}

export {TestableHttpClientMock}
