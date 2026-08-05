/**
 * Text 文字溢出提示组件的属性定义
 */
export interface TextProps {
  /**
   * 展示文字（支持 v-model）
   */
  modelValue?: string
  /**
   * 是否开启 tooltip，内容不满时自动隐藏
   * @default true
   */
  toolTip?: boolean
  /**
   * 展示几行省略
   * @default 1
   */
  toolTipLine?: number
  /**
   * tooltip 的最大宽度
   * @default 600
   */
  toolTipMaxWidth?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800
  /**
   * tooltip 的最大高度
   * @default 300
   */
  toolTipMaxHeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800
  /**
   * 文字行高
   * @default 20
   */
  lineHeight?: number
}
