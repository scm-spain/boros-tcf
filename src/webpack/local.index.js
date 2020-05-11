import BorosTcf from '../main'

BorosTcf.init()

window.__tcfapi('ping', 2, data => {
  console.log('PING > ', data)
})
