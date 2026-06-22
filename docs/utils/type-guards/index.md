# 类型判断

`type-guards` 目录用于承载所有运行时类型判断方法，对应源码目录 `packages/utils/type-guards/`。

其中既包含统一入口 `is`，也包含 `isDate`、`isString` 这类一个方法一个文件的具名导出。

## 使用方式

```ts
import { is } from 'bzsh-ui'

is.string('demo') // true
is.number(1) // true
is.array([]) // true
is.arrayBuffer(new ArrayBuffer(8)) // true
is.null(null) // true
is.plainObject({}) // true
```

## 为什么有 is 和 isXxx 两种形式

- `is.xxx` 适合统一风格、集中书写条件判断。
- `isXxx` 适合按需导入，减少单个文件中的导入项层级。
- 两者底层逻辑一致，只是暴露形式不同。
- 面向组件库使用者时，优先使用 `bzsh-ui` 作为导入入口。

## 当前支持

| 方法             | 说明                     |
| ---------------- | ------------------------ |
| `is.array`       | 判断是否为数组           |
| `is.arrayBuffer` | 判断是否为 `ArrayBuffer` |
| `is.bigInt`      | 判断是否为 `bigint`      |
| `is.boolean`     | 判断是否为布尔值         |
| `is.date`        | 判断是否为 `Date`        |
| `is.error`       | 判断是否为 `Error`       |
| `is.function`    | 判断是否为函数           |
| `is.map`         | 判断是否为 `Map`         |
| `is.null`        | 判断是否为 `null`        |
| `is.number`      | 判断是否为数字           |
| `is.object`      | 判断是否为对象           |
| `is.plainObject` | 判断是否为普通对象       |
| `is.promise`     | 判断是否为 `Promise`     |
| `is.regExp`      | 判断是否为 `RegExp`      |
| `is.set`         | 判断是否为 `Set`         |
| `is.string`      | 判断是否为字符串         |
| `is.symbol`      | 判断是否为 `Symbol`      |
| `is.undefined`   | 判断是否为 `undefined`   |
| `is.weakMap`     | 判断是否为 `WeakMap`     |
| `is.weakSet`     | 判断是否为 `WeakSet`     |

## 典型场景

```ts
import { is } from 'bzsh-ui'

function normalizeValue(value: unknown) {
  if (is.string(value)) {
    return value.trim()
  }

  if (is.array(value)) {
    return value.length
  }

  if (is.plainObject(value)) {
    return Object.keys(value)
  }

  return value
}
```

## 同步导出

除了 `is.xxx` 这种聚合用法，工具包也同步导出了独立函数，并且这些独立函数都放在 `packages/utils/type-guards/` 下单独维护：

```ts
import { isArray, isNumber, isString } from 'bzsh-ui'
```

## 推荐方式

- 需要统一风格时，优先使用 `is.xxx`。
- 需要单独按需导入时，使用 `isArray`、`isString` 这类具名导出。
- 只有在 monorepo 内部按包开发时，才考虑使用 `@bzsh-ui/utils` 这类工作区路径。
- 对外使用时，不使用 `@bzsh-ui`，而是直接从 `bzsh-ui` 导入。

## 单项页面

- 基础类型：[isString](./is-string)、[isNumber](./is-number)、[isBoolean](./is-boolean)、[isBigInt](./is-big-int)、[isSymbol](./is-symbol)、[isUndefined](./is-undefined)、[isNull](./is-null)
- 集合类型：[isArray](./is-array)、[isSet](./is-set)、[isMap](./is-map)、[isWeakSet](./is-weak-set)、[isWeakMap](./is-weak-map)、[isArrayBuffer](./is-arraybuffer)
- 对象类型：[isObject](./is-object)、[isPlainObject](./is-plain-object)、[isDate](./is-date)、[isRegExp](./is-reg-exp)、[isError](./is-error)、[isPromise](./is-promise)、[isFunction](./is-function)

## 继续阅读

- [type-utils](../type-utils/)
- [getDataType](../type-utils/get-data-type)
- [isString](./is-string)
- [isNumber](./is-number)
- [isArray](./is-array)
- [isPlainObject](./is-plain-object)
- [isDate](./is-date)
