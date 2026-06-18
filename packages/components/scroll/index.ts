import { withInstall } from '@bzsh-ui/internal'

import Scroll from './src/scroll.vue'

/**
 * 滚动组件
 * 提供可自定义的滚动视图
 */
export const BzScroll = withInstall(Scroll, 'BzScroll')

export default BzScroll
export * from './props'
