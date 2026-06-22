import { getDataType } from '../type-utils/get-data-type'

/**
 * 表示普通对象结构的共享类型。
 */
export type PlainObject = Record<PropertyKey, unknown>

/**
 * 基于 getDataType 的结果比较运行时类型。
 * @param value 要检查的值
 * @param expectedType 预期的小写类型名称
 * @returns 如果运行时类型匹配则返回 true，否则返回 false
 */
export function hasType(value: unknown, expectedType: string): boolean {
  return getDataType(value) === expectedType
}
