import type { ButtonProps } from '@bzsh-ui/components'

/**
 * 按钮数据项定义
 */
export interface ButtonActionItem {
  /**
   * 按钮唯一标识
   */
  key: string | number
  /**
   * 按钮文本
   */
  label: string
  /**
   * 按钮类型，继承自 ButtonProps
   */
  type?: ButtonProps['type']
  /**
   * 按钮尺寸，继承自 ButtonProps
   */
  size?: ButtonProps['size']
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否为朴素按钮
   */
  plain?: boolean
  /**
   * 是否为圆角按钮
   */
  round?: boolean
  /**
   * 是否为圆形按钮
   */
  circle?: boolean
  /**
   * 点击事件回调
   */
  onClick?: (item: ButtonActionItem) => void
}

/**
 * ButtonAction 组件的属性定义
 */
export interface ButtonActionProps {
  /**
   * 按钮组数据
   */
  items: ButtonActionItem[]
  /**
   * 按钮尺寸（全局设置，会被单个按钮的 size 覆盖）
   */
  size?: ButtonProps['size']
  /**
   * 是否禁用所有按钮（会被单个按钮的 disabled 覆盖）
   */
  disabled?: boolean
}
