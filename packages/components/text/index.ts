import { withInstall } from '@bzsh-ui/internal'

import Text from './src/text.vue'

/**
 * 文字溢出提示组件
 * 文字超出容器宽度时显示省略号，并可通过 tooltip 查看完整内容
 */
export const BzText = withInstall(Text, 'BzText')

export default BzText
export * from './props'
