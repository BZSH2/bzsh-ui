import './style.scss'

import { defaultComponents } from './defaults'
import { makeInstaller } from './make-installer'

export * from '../components'

const installer = makeInstaller(defaultComponents)

export const install = installer.install
export default installer
