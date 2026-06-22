import { hasType } from './guards'

/**
 * 检查值是否为 `number` 类型。
 * @param value 要检查的值
 * @returns 如果值符合对应类型则返回 true，否则返回 false
 */
export function isNumber(value: unknown): value is number {
  return hasType(value, 'number')
}
