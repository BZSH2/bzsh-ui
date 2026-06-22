/**
 * Scroll 滚动组件的属性定义
 */
export interface ScrollProps {
  /**
   * 滚动组件高度
   */
  height?: string
  /**
   * 滚动组件类名
   */
  class?: string
  /**
   * 滚动组件标签文本
   */
  label?: string
  /**
   * 滚动组件距离底部触发事件的距离
   */
  distance?: number
}

export type ScrollDirection = 'top' | 'bottom' | 'left' | 'right'
