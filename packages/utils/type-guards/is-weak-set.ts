import { hasType } from './guards'

/**
 * 检查值是否为WeakSet 实例。
 * @param value 要检查的值
 * @returns 如果值符合对应类型则返回 true，否则返回 false
 */
export function isWeakSet(value: unknown): value is WeakSet<object> {
  return hasType(value, 'weakset')
}
