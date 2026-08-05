# Utils 工具函数

`utils` 目录承载与组件无强耦合的公共工具函数，主要服务于运行时判断、数据处理和跨包复用场景。

## 当前结构

当前工具按源码目录分成三层：

- `type-utils`：底层类型工具，当前提供 `getDataType()`。
- `type-guards`：类型判断工具，既提供 `is.xxx` 聚合入口，也提供 `isXxx` 独立方法。
- `function-utils`：函数调用频率控制工具，既提供 `debounce()`、`throttle()`，也提供 `func.xxx` 聚合入口。

文档目录与源码目录一一对应：

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
- `is.xxx`
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
- `func.xxx`
- [debounce](./function-utils/debounce)
- [throttle](./function-utils/throttle)

## 使用方式

```ts
import { debounce, func, getDataType, is, isNumber, throttle } from 'bzsh-ui'
```

## 快速示例

```ts
import { debounce, func, getDataType, is, isString, throttle } from 'bzsh-ui'

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
func.throttle(() => console.log('from func'), 200)
onSearch('demo')
onScroll()
```

文档默认展示对外使用方式，也就是从 `bzsh-ui` 导入；只有在 monorepo 内部维护源码时，才考虑 `@bzsh-ui/utils` 这类工作区路径。

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
- 需要统一从函数工具对象读取：使用 `func.debounce`、`func.throttle`。
- 需要降低输入、滚动、resize 一类高频触发：使用 `debounce()` 或 `throttle()`。

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
