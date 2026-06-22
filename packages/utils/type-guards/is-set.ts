import { hasType } from './guards'

/**
 * 检查值是否为Set 实例。
 * @param value 要检查的值
 * @returns 如果值符合对应类型则返回 true，否则返回 false
 */
export function isSet(value: unknown): value is Set<unknown> {
  return hasType(value, 'set')
}
