import nock from 'nock'
import {GVLFactory} from '../../../../../main/infrastructure/repository/iab/GVLFactory'
import {
  VendorListValueEnglish,
  VendorListValueSpanish
} from '../../../../fixtures/vendorlist/VendorListValue'

const BASE_URL = 'http://mock.borostcf.com/borostcf/v2/vendorlist'
export const UNAVAILABLE_VERSION = 9999999
export class TestableGVLFactory extends GVLFactory {
  constructor() {
    super({
      baseUrl: BASE_URL
    })
    super.resetCaches()

    nock('http://mock.borostcf.com/borostcf/v2/vendorlist')
      .get('/LATEST?language=es')
      .reply(200, VendorListValueSpanish.data, {
        'access-control-allow-origin': '*',
        'access-control-allow-credentials': 'true'
      })
      .persist()

    nock('http://mock.borostcf.com/borostcf/v2/vendorlist')
      .get('/LATEST?language=en')
      .reply(200, VendorListValueEnglish.data, {
        'access-control-allow-origin': '*',
        'access-control-allow-credentials': 'true'
      })
      .persist()

    nock('http://mock.borostcf.com/borostcf/v2/vendorlist')
      .get('/36?language=en')
      .reply(200, VendorListValueEnglish.data, {
        'access-control-allow-origin': '*',
        'access-control-allow-credentials': 'true'
      })
      .persist()

    nock('http://mock.borostcf.com/borostcf/v2/vendorlist')
      .get('/36?language=es')
      .reply(200, VendorListValueSpanish.data, {
        'access-control-allow-origin': '*',
        'access-control-allow-credentials': 'true'
      })
      .persist()

    nock('http://mock.borostcf.com/borostcf/v2/vendorlist')
      .get(`/${UNAVAILABLE_VERSION}?language=es`)
      .replyWithError({
        message: 'Unavailable',
        code: 'WHATEVER_ERROR'
      })
  }

  reset() {
    nock.cleanAll()
    nock.abortPendingRequests()
  }

  mockReply({path, data}) {
    return nock('http://mock.borostcf.com/borostcf/v2/vendorlist')
      .get(path)
      .reply(200, data, {
        'access-control-allow-origin': '*',
        'access-control-allow-credentials': 'true'
      })
  }
}
