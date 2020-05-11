import axios from 'axios'
import {HttpClient} from './HttpClient'

class AxiosHttpClient extends HttpClient {
  constructor() {
    super()
    this._axios = axios
  }

  get({url, options}) {
    return this._axios.get(url, options)
  }
}

export {AxiosHttpClient}
