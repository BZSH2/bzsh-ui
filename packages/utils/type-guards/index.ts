export * from './is-array'
export * from './is-arraybuffer'
export * from './is-big-int'
export * from './is-boolean'
export * from './is-date'
export * from './is-error'
export * from './is-function'
export * from './is-map'
export * from './is-null'
export * from './is-number'
export * from './is-object'
export * from './is-plain-object'
export * from './is-promise'
export * from './is-reg-exp'
export * from './is-set'
export * from './is-string'
export * from './is-symbol'
export * from './is-undefined'
export * from './is-weak-map'
export * from './is-weak-set'

/**
 * 统一导出所有类型守卫，并提供 is.xxx 风格的聚合入口。
 */

import { isArray } from './is-array'
import { isArrayBuffer } from './is-arraybuffer'
import { isBigInt } from './is-big-int'
import { isBoolean } from './is-boolean'
import { isDate } from './is-date'
import { isError } from './is-error'
import { isFunction } from './is-function'
import { isMap } from './is-map'
import { isNull } from './is-null'
import { isNumber } from './is-number'
import { isObject } from './is-object'
import { isPlainObject } from './is-plain-object'
import { isPromise } from './is-promise'
import { isRegExp } from './is-reg-exp'
import { isSet } from './is-set'
import { isString } from './is-string'
import { isSymbol } from './is-symbol'
import { isUndefined } from './is-undefined'
import { isWeakMap } from './is-weak-map'
import { isWeakSet } from './is-weak-set'

/**
 * 集中管理所有类型守卫，并提供 `is.xxx` 风格的统一入口。
 */
export const is = {
  array: isArray,
  arrayBuffer: isArrayBuffer,
  bigInt: isBigInt,
  boolean: isBoolean,
  date: isDate,
  error: isError,
  function: isFunction,
  map: isMap,
  null: isNull,
  number: isNumber,
  object: isObject,
  plainObject: isPlainObject,
  promise: isPromise,
  regExp: isRegExp,
  set: isSet,
  string: isString,
  symbol: isSymbol,
  undefined: isUndefined,
  weakMap: isWeakMap,
  weakSet: isWeakSet,
} as const
