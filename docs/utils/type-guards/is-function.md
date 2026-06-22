# isFunction

`isFunction` 用于判断一个值是否为函数。

## 签名

```ts
function isFunction(value: unknown): value is Function
```

## 示例

```ts
import { isFunction } from 'bzsh-ui'

isFunction(() => {}) // true
isFunction({}) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.function(function demo() {}) // true
is.function({}) // false
```

## 行为说明

- 仅当值的运行时类型为 `function` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-function.ts`。

## 适用场景

- 执行回调前判断入参是否可调用。
- 工具函数中做 handler 校验。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
