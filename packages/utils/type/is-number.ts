/**
 * 检查值是否为有效的数字类型
 * @param value 要检查的值
 * @returns 如果是有效数字则返回 true，否则返回 false
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}
