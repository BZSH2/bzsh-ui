/**
 * 按钮类型
 */
export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

/**
 * 按钮尺寸
 */
export type ButtonSize = 'small' | 'medium' | 'large'

/**
 * Button 组件的属性定义
 */
export interface ButtonProps {
  /**
   * 按钮类型
   */
  type?: ButtonType
  /**
   * 按钮尺寸
   */
  size?: ButtonSize
  /**
   * 是否禁用按钮
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
   * 按钮标签文本
   */
  label?: string
}
