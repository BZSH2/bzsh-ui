import { hasType } from './guards'

/**
 * 检查值是否为ArrayBuffer 实例。
 * @param value 要检查的值
 * @returns 如果值符合对应类型则返回 true，否则返回 false
 */
export function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return hasType(value, 'arraybuffer')
}
