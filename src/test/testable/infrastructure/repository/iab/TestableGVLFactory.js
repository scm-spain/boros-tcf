import nock from 'nock'
import {GVLFactory} from '../../../../../main/infrastructure/repository/iab/GVLFactory'
import GVL_36_EN from '../../../../fixtures/vendorlist/vendorlist.v36.EN.json'
import GVL_36_ES from '../../../../fixtures/vendorlist/vendorlist.v36.ES.json'
import GVL_44_ES from '../../../../fixtures/vendorlist/vendorlist.v44.ES.json'
import GVL_44_EN from '../../../../fixtures/vendorlist/vendorlist.v44.EN.json'

export const UNAVAILABLE_VERSION = 9999999
export const OLDEST_GVL_VERSION = 36
export const LATEST_GVL_VERSION = 44
export const GVL_ES_LANGUAGE = 'es'
export const GVL_EN_LANGUAGE = 'en'

export const LATEST_GVL_ES_DATA = {
  language: GVL_ES_LANGUAGE,
  version: LATEST_GVL_VERSION,
  vendorList: GVL_44_ES
}
export const LATEST_GVL_EN_DATA = {
  language: GVL_EN_LANGUAGE,
  version: LATEST_GVL_VERSION,
  vendorList: GVL_44_EN
}
export const OLDEST_GVL_ES_DATA = {
  language: GVL_ES_LANGUAGE,
  version: OLDEST_GVL_VERSION,
  vendorList: GVL_36_ES
}
export const OLDEST_GVL_EN_DATA = {
  language: GVL_EN_LANGUAGE,
  version: OLDEST_GVL_VERSION,
  vendorList: GVL_36_EN
}

const BASE_URL = 'http://mock.borostcf.com/borostcf/v2/vendorlist'
const DATA = [
  OLDEST_GVL_ES_DATA,
  OLDEST_GVL_EN_DATA,
  LATEST_GVL_ES_DATA,
  LATEST_GVL_EN_DATA
]
export class TestableGVLFactory extends GVLFactory {
  constructor({language = 'es', latestGvlVersion = LATEST_GVL_VERSION} = {}) {
    super({
      baseUrl: BASE_URL,
      language
    })
    super.resetCaches()
    this.reset()

    let latestFound = false
    DATA.filter(data => data.version <= latestGvlVersion).forEach(data => {
      if (data.version === latestGvlVersion) {
        latestFound = true
        this._nockOkResponse({...data, version: 'LATEST'})
      }
      this._nockOkResponse(data)
    })
    if (!latestFound) {
      throw new Error(
        'TestableGVLFactory does not have a valid latest version: ' +
          latestGvlVersion
      )
    }
    this._nockKoResponse({
      version: UNAVAILABLE_VERSION,
      language: GVL_ES_LANGUAGE
    })
    this._nockKoResponse({
      version: UNAVAILABLE_VERSION,
      language: GVL_EN_LANGUAGE
    })
  }

  reset() {
    nock.cleanAll()
  }

  mockReply({path, data}) {
    return nock('http://mock.borostcf.com/borostcf/v2/vendorlist')
      .get(path)
      .reply(200, data, {
        'access-control-allow-origin': '*',
        'access-control-allow-credentials': 'true'
      })
  }

  _nockKoResponse({version, language}) {
    nock('http://mock.borostcf.com/borostcf/v2/vendorlist')
      .get(`/${version}/${language}`)
      .replyWithError({
        message: 'Unavailable',
        code: 'WHATEVER_ERROR'
      })
  }

  _nockOkResponse({version, language, vendorList}) {
    nock('http://mock.borostcf.com/borostcf/v2/vendorlist')
      .get(`/${version}/${language}`)
      .reply(200, vendorList, {
        'access-control-allow-origin': '*',
        'access-control-allow-credentials': 'true'
      })
      .persist()
  }
}
