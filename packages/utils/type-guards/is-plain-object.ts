import { isObject } from './is-object'

import type { PlainObject } from './guards'

/**
 * 检查值是否为普通对象。
 * @param value 要检查的值
 * @returns 如果值符合对应类型则返回 true，否则返回 false
 */
export function isPlainObject(value: unknown): value is PlainObject {
  if (!isObject(value)) {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.prototype
}
