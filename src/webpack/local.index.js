import BorosTcf from '../main'

const reporter = {
  notify: (event, payload) => console.log(`BorosTCF [${event}]`, payload)
}
BorosTcf.init({reporter})

window.__tcfapi('ping', 2, data => {
  console.log('PING > ', data)
})

window.__tcfapi('getVendorList', 2, data => {
  console.log('GET VENDOR LIST > ', data)
})
