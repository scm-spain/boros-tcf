import nock from 'nock'
import {GVLFactory} from '../../../../../main/infrastructure/repository/iab/GVLFactory'
import {
  VendorListValueEnglish,
  VendorListValueSpanish
} from '../../../../fixtures/vendorlist/VendorListValue'
import {GVL} from '@iabtcf/core'

const BASE_URL = 'http://mock.borostcf.com/borostcf/v2/vendorlist'
export const UNAVAILABLE_VERSION = 9999999
export class TestableGVLFactory extends GVLFactory {
  constructor({language} = {}) {
    super({
      baseUrl: BASE_URL,
      language
    })
    this.reset()
  }

  reset() {
    GVL.emptyCache()
    GVL.emptyLanguageCache()

    nock.cleanAll()
    nock(BASE_URL)
      .get('/LATEST?language=es')
      .reply(200, VendorListValueSpanish.data, {
        'access-control-allow-origin': '*',
        'access-control-allow-credentials': 'true'
      })
      .persist()

    nock(BASE_URL)
      .get('/LATEST?language=en')
      .reply(200, VendorListValueEnglish.data, {
        'access-control-allow-origin': '*',
        'access-control-allow-credentials': 'true'
      })
      .persist()

    nock(BASE_URL)
      .get('/36?language=en')
      .reply(200, VendorListValueEnglish.data, {
        'access-control-allow-origin': '*',
        'access-control-allow-credentials': 'true'
      })
      .persist()

    nock(BASE_URL)
      .get(`/${UNAVAILABLE_VERSION}?language=es`)
      .replyWithError({
        message: 'Unavailable',
        code: 'WHATEVER_ERROR'
      })
  }
}
