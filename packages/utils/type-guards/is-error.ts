import { hasType } from './guards'

/**
 * 检查值是否为Error 实例。
 * @param value 要检查的值
 * @returns 如果值符合对应类型则返回 true，否则返回 false
 */
export function isError(value: unknown): value is Error {
  return hasType(value, 'error')
}
