import {iocInjector} from 'brusc'
import {PACKAGE_NAME} from '../constants'

const IOC_MODULE = PACKAGE_NAME
const inject = key => iocInjector(IOC_MODULE)(key)

export {IOC_MODULE, inject}
