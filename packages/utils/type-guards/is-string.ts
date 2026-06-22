import { hasType } from './guards'

/**
 * 检查值是否为字符串。
 * @param value 要检查的值
 * @returns 如果值符合对应类型则返回 true，否则返回 false
 */
export function isString(value: unknown): value is string {
  return hasType(value, 'string')
}
