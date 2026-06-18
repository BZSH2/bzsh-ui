import { withInstall } from '@bzsh-ui/internal'

import Button from './src/button.vue'

/**
 * 按钮组件
 * 支持不同类型、尺寸、形状的按钮
 */
export const BzButton = withInstall(Button, 'BzButton')

export default BzButton
export * from './props'
