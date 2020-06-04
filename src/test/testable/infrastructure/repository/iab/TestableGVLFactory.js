import nock from 'nock'
import {GVLFactory} from '../../../../../main/infrastructure/repository/iab/GVLFactory'
import {VendorListValue} from '../../../../fixtures/vendorlist/VendorListValue'

const BASE_URL = 'http://mock.borostcf.com/borostcf/v2/vendorlist'
export const UNAVAILABLE_VERSION = 9999999
export class TestableGVLFactory extends GVLFactory {
  constructor() {
    super({
      baseUrl: BASE_URL
    })

    nock('http://mock.borostcf.com/borostcf/v2/vendorlist')
      .get('/LATEST?language=es')
      .reply(200, VendorListValue.data, {
        'access-control-allow-origin': '*',
        'access-control-allow-credentials': 'true'
      })

    nock('http://mock.borostcf.com/borostcf/v2/vendorlist')
      .get(`/${UNAVAILABLE_VERSION}?language=es`)
      .replyWithError({
        message: 'Unavailable',
        code: 'WHATEVER_ERROR'
      })
  }

  reset() {
    nock.cleanAll()
  }
}
