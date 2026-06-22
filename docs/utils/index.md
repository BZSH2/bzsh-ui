# Utils 工具函数

`utils` 目录承载与组件无强耦合的公共工具函数，主要服务于运行时判断、数据处理和跨包复用场景。

## 推荐理解方式

可以把当前这组工具分成三类：

- `type-utils`：负责统一返回运行时类型名称，例如 `getDataType()`。
- `type-guards`：负责把类型判断封装成更直观的布尔守卫，例如 `is.xxx` 和 `isXxx`。
- `function-utils`：负责处理函数调用频率控制，例如 `debounce()` 和 `throttle()`。

如果只是想知道一个值到底是什么类型，用 `getDataType()` 更直接；如果只是想做条件判断，优先使用 `is.xxx` 或 `isXxx`；如果想控制高频事件触发，优先使用 `debounce()` 或 `throttle()`。

现在文档目录也与源码目录保持一致：

- `packages/utils/type-utils/` 对应 `docs/utils/type-utils/`
- `packages/utils/type-guards/` 对应 `docs/utils/type-guards/`
- `packages/utils/function-utils/` 对应 `docs/utils/function-utils/`

这样查源码和查文档时，目录语义可以直接对上。

## 分类概览

### 类型获取

- [type-utils](./type-utils/)
- [getDataType](./type-utils/get-data-type)

### 类型判断

- [type-guards](./type-guards/)
- [isArray](./type-guards/is-array)
- [isArrayBuffer](./type-guards/is-arraybuffer)
- [isBigInt](./type-guards/is-big-int)
- [isBoolean](./type-guards/is-boolean)
- [isDate](./type-guards/is-date)
- [isError](./type-guards/is-error)
- [isFunction](./type-guards/is-function)
- [isMap](./type-guards/is-map)
- [isNull](./type-guards/is-null)
- [isNumber](./type-guards/is-number)
- [isObject](./type-guards/is-object)
- [isPlainObject](./type-guards/is-plain-object)
- [isPromise](./type-guards/is-promise)
- [isRegExp](./type-guards/is-reg-exp)
- [isSet](./type-guards/is-set)
- [isString](./type-guards/is-string)
- [isSymbol](./type-guards/is-symbol)
- [isUndefined](./type-guards/is-undefined)
- [isWeakMap](./type-guards/is-weak-map)
- [isWeakSet](./type-guards/is-weak-set)

### 函数控制

- [function-utils](./function-utils/)
- [debounce](./function-utils/debounce)
- [throttle](./function-utils/throttle)

其中：

- `getDataType` 放在 `packages/utils/type-utils/`
- 所有 `isXxx` 独立函数放在 `packages/utils/type-guards/`，保持一个方法一个文件
- `is` 对象负责把这些独立函数再聚合成统一入口

## 使用方式

```ts
import { debounce, getDataType, is, isNumber, isString, throttle } from 'bzsh-ui'
```

## 快速示例

```ts
import { debounce, getDataType, is, isString, throttle } from 'bzsh-ui'

const value: unknown = 'hello'
const onSearch = debounce((keyword: string) => {
  console.log(keyword)
}, 300)
const onScroll = throttle(() => {
  console.log('scroll')
}, 200)

getDataType(value) // 'string'
is.string(value) // true
isString(value) // true
onSearch('demo')
onScroll()
```

面向组件库使用者时，文档默认展示 `bzsh-ui` 导入方式。

如果你当前是在本仓库内部维护 `packages/utils`，才考虑使用 `@bzsh-ui/utils` 这类工作区路径；它不是对外发布时的默认导入入口。

## 开发约定

- 新增工具函数使用 `pnpm utils <name>`。
- `getDataType()` 放在 `packages/utils/type-utils/`，作为底层类型获取方法。
- `isXxx` 这类类型判断函数放在 `packages/utils/type-guards/`，保持一个文件只做一种判断。
- `debounce()`、`throttle()` 这类函数控制工具放在 `packages/utils/function-utils/`。
- `packages/utils/type-guards/index.ts` 负责导出独立函数，并组装 `is.xxx` 聚合对象。
- `packages/utils/function-utils/index.ts` 负责导出独立函数，并组装 `func.xxx` 聚合对象。
- 如果工具函数具备明确输入输出语义，优先补充 Vitest 用例。

## 如何选择

- 需要拿到明确的类型名称：使用 `getDataType()`。
- 需要统一链式风格：使用 `is.xxx`。
- 需要按需导入单个方法：使用 `isNumber`、`isString` 这类独立函数。
- 需要降低输入、滚动、resize 一类高频触发：使用 `debounce()` 或 `throttle()`。

## 单项文档

- 基础类型：[isString](./type-guards/is-string)、[isNumber](./type-guards/is-number)、[isBoolean](./type-guards/is-boolean)、[isBigInt](./type-guards/is-big-int)、[isSymbol](./type-guards/is-symbol)、[isUndefined](./type-guards/is-undefined)、[isNull](./type-guards/is-null)
- 集合类型：[isArray](./type-guards/is-array)、[isSet](./type-guards/is-set)、[isMap](./type-guards/is-map)、[isWeakSet](./type-guards/is-weak-set)、[isWeakMap](./type-guards/is-weak-map)、[isArrayBuffer](./type-guards/is-arraybuffer)
- 对象类型：[isObject](./type-guards/is-object)、[isPlainObject](./type-guards/is-plain-object)、[isDate](./type-guards/is-date)、[isRegExp](./type-guards/is-reg-exp)、[isError](./type-guards/is-error)、[isPromise](./type-guards/is-promise)、[isFunction](./type-guards/is-function)
- 函数控制：[debounce](./function-utils/debounce)、[throttle](./function-utils/throttle)

## 继续阅读

- [type-utils](./type-utils/)
- [type-guards](./type-guards/)
- [function-utils](./function-utils/)
- [getDataType](./type-utils/get-data-type)
- [isString](./type-guards/is-string)
- [isNumber](./type-guards/is-number)
- [isArray](./type-guards/is-array)
- [isPlainObject](./type-guards/is-plain-object)
- [isDate](./type-guards/is-date)
- [debounce](./function-utils/debounce)
- [throttle](./function-utils/throttle)
