import './style.scss'

export * from '@bzsh-ui/components'
export * from '@bzsh-ui/utils'

import { defaultComponents } from './defaults'
import { makeInstaller } from './make-installer'

const installer = makeInstaller(defaultComponents)

export const install = installer.install
export default installer
