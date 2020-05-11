import {HttpClient} from '../../../../main/infrastructure/repository/http/HttpClient'

class TestableHttpClient extends HttpClient {
  constructor() {
    super()
    this._requests = []
  }

  post(postRequest) {
    this._requests.push(postRequest)
  }

  get requests() {
    return this._requests
  }
}

export {TestableHttpClient}
