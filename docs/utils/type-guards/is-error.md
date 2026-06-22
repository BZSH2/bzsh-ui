# isError

`isError` 用于判断一个值是否为 `Error` 实例。

## 签名

```ts
function isError(value: unknown): value is Error
```

## 示例

```ts
import { isError } from 'bzsh-ui'

isError(new Error('demo')) // true
isError({ message: 'demo' }) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.error(new TypeError('demo')) // true
is.error({ message: 'demo' }) // false
```

## 行为说明

- 仅当值的运行时类型为 `error` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-error.ts`。

## 适用场景

- 统一错误处理前判断是否为 Error 对象。
- 兼容业务代码里混入的非标准错误值。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
