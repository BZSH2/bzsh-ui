import { hasType } from './guards'

import type { PlainObject } from './guards'

/**
 * 检查值是否为对象。
 * @param value 要检查的值
 * @returns 如果值符合对应类型则返回 true，否则返回 false
 */
export function isObject(value: unknown): value is PlainObject {
  return hasType(value, 'object')
}
