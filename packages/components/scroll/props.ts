import type { ScrollbarProps as ElScrollbarProps } from 'element-plus'

/**
 * Scroll 滚动组件的属性定义
 * @description 继承自 Element Plus Scrollbar 所有属性
 */
export interface ScrollProps extends ElScrollbarProps {
  /**
   * 自定义滚动名
   */
  class?: string
}

export type { ScrollbarDirection } from 'element-plus'
