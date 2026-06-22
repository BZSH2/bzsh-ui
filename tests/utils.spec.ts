import { describe, expect, it } from 'vitest'

import {
  getDataType,
  is,
  isArray,
  isArrayBuffer,
  isBigInt,
  isBoolean,
  isDate,
  isError,
  isFunction,
  isMap,
  isNull,
  isNumber,
  isObject,
  isPlainObject,
  isPromise,
  isRegExp,
  isSet,
  isString,
  isSymbol,
  isUndefined,
  isWeakMap,
  isWeakSet,
} from '../packages/utils'

describe('getDataType', () => {
  it('returns normalized runtime type names', () => {
    expect(getDataType('demo')).toBe('string')
    expect(getDataType(1)).toBe('number')
    expect(getDataType(false)).toBe('boolean')
    expect(getDataType([])).toBe('array')
    expect(getDataType(null)).toBe('null')
    expect(getDataType(undefined)).toBe('undefined')
    expect(getDataType(new Date())).toBe('date')
    expect(getDataType(/demo/u)).toBe('regexp')
    expect(getDataType(new Map())).toBe('map')
    expect(getDataType(new Set())).toBe('set')
  })
})

describe('is primitive guards', () => {
  it('checks string values', () => {
    expect(isString('')).toBe(true)
    expect(is.string('demo')).toBe(true)
    expect(isString(1)).toBe(false)
  })

  it('checks number values by runtime type', () => {
    expect(isNumber(0)).toBe(true)
    expect(is.number(Number.NaN)).toBe(true)
    expect(isNumber('1')).toBe(false)
  })

  it('checks boolean, null, undefined and symbol values', () => {
    expect(isBoolean(false)).toBe(true)
    expect(is.boolean(true)).toBe(true)
    expect(isBigInt(1n)).toBe(true)
    expect(is.bigInt(2n)).toBe(true)
    expect(isNull(null)).toBe(true)
    expect(is.null(undefined)).toBe(false)
    expect(isUndefined(undefined)).toBe(true)
    expect(is.undefined(null)).toBe(false)
    expect(isSymbol(Symbol('demo'))).toBe(true)
  })
})

describe('is reference guards', () => {
  it('checks arrays, functions and objects', () => {
    expect(isArray([])).toBe(true)
    expect(is.array({})).toBe(false)
    expect(isFunction(() => null)).toBe(true)
    expect(isObject({ demo: true })).toBe(true)
    expect(isObject(new (class Demo {})())).toBe(true)
  })

  it('checks plain objects', () => {
    expect(isPlainObject({ demo: true })).toBe(true)
    expect(is.plainObject(Object.create(null))).toBe(true)
    expect(isPlainObject([])).toBe(false)
    expect(isPlainObject(new Date())).toBe(false)
  })

  it('checks built-in object instances', () => {
    expect(isArrayBuffer(new ArrayBuffer(8))).toBe(true)
    expect(is.arrayBuffer(new ArrayBuffer(16))).toBe(true)
    expect(isDate(new Date())).toBe(true)
    expect(isRegExp(/demo/u)).toBe(true)
    expect(is.regExp(/demo/u)).toBe(true)
    expect(isMap(new Map())).toBe(true)
    expect(isSet(new Set())).toBe(true)
    expect(isWeakMap(new WeakMap())).toBe(true)
    expect(isWeakSet(new WeakSet())).toBe(true)
    expect(isPromise(Promise.resolve())).toBe(true)
    expect(isError(new TypeError('demo'))).toBe(true)
    expect(is.error(new TypeError('demo'))).toBe(true)
  })
})
