import {CookieStorage} from '../../../../main/infrastructure/repository/cookie/CookieStorage'

class TestableCookieStorageMock extends CookieStorage {
  constructor() {
    super()
    this._storage = new Map()
  }

  load({key}) {
    return this._storage.get(key)
  }

  save({key, data}) {
    this._storage.set(key, data)
  }

  get storage() {
    return this._storage
  }
}

export {TestableCookieStorageMock}
