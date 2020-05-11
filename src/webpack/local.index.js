import BorosTcf from '../main'

BorosTcf.init()

window.__tcfapi('ping', 2, data => {
  console.log('PING > ', data)
})

window.__tcfapi('getVendorList', 2, data => {
  console.log('GET VENDOR LIST > ', data)
})
