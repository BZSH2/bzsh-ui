import { withInstall } from '@bzsh-ui/internal'

import ButtonAction from './src/button-action.vue'

/**
 * 按钮组组件
 * 支持通过数据配置多个按钮，统一管理
 */
export const BzButtonAction = withInstall(ButtonAction, 'BzButtonAction')

export default BzButtonAction
export * from './props'
