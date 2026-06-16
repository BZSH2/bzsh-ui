import Scroll from './src/scroll.vue'
import { withInstall } from '../../internal/with-install'

export const BzScroll = withInstall(Scroll, 'BzScroll')

export default BzScroll
export * from './props'
