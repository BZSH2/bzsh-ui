import { hasType } from './guards'

/**
 * 检查值是否为布尔值。
 * @param value 要检查的值
 * @returns 如果值符合对应类型则返回 true，否则返回 false
 */
export function isBoolean(value: unknown): value is boolean {
  return hasType(value, 'boolean')
}
