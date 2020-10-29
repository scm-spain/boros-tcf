import nock from 'nock'
import {GVLFactory} from '../../../../../main/infrastructure/repository/iab/GVLFactory'
import {GVL_36_EN} from '../../../../fixtures/vendorlist/vendorlist.v36.EN'
import {GVL_36_ES} from '../../../../fixtures/vendorlist/vendorlist.v36.ES'
import {GVL_44_ES} from '../../../../fixtures/vendorlist/vendorlist.v44.ES'
import {GVL_44_EN} from '../../../../fixtures/vendorlist/vendorlist.v44.EN'

export const UNAVAILABLE_VERSION = 9999999
export const LATEST_VERSION = 44
const BASE_URL = 'http://mock.borostcf.com/borostcf/v2/vendorlist'
const DATA = [
  {
    language: 'es',
    version: 36,
    vendorList: GVL_36_ES
  },
  {
    language: 'en',
    version: 36,
    vendorList: GVL_36_EN
  },
  {
    language: 'es',
    version: 44,
    vendorList: GVL_44_ES
  },
  {
    language: 'en',
    version: 44,
    vendorList: GVL_44_EN
  }
]
export class TestableGVLFactory extends GVLFactory {
  constructor({language = 'es', latestVersion = LATEST_VERSION} = {}) {
    super({
      baseUrl: BASE_URL,
      language
    })
    super.resetCaches()
    this.reset()

    let latestFound = false
    DATA.filter(data => data.version <= latestVersion).forEach(data => {
      if (data.version === latestVersion) {
        latestFound = true
        this._nockOkResponse({...data, version: 'LATEST'})
      }
      this._nockOkResponse(data)
    })
    if (!latestFound) {
      throw new Error(
        'TestableGVLFactory does not have a valid latest version: ' +
          latestVersion
      )
    }
    this._nockKoResponse({version: UNAVAILABLE_VERSION, language: 'es'})
    this._nockKoResponse({version: UNAVAILABLE_VERSION, language: 'en'})
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
      .get(`/${version}?language=${language}`)
      .replyWithError({
        message: 'Unavailable',
        code: 'WHATEVER_ERROR'
      })
  }

  _nockOkResponse({version, language, vendorList}) {
    nock('http://mock.borostcf.com/borostcf/v2/vendorlist')
      .get(`/${version}?language=${language}`)
      .reply(200, vendorList, {
        'access-control-allow-origin': '*',
        'access-control-allow-credentials': 'true'
      })
      .persist()
  }
}
