# isNull

`isNull` 用于判断一个值是否为 `null`。

## 签名

```ts
function isNull(value: unknown): value is null
```

## 示例

```ts
import { isNull } from 'bzsh-ui'

isNull(null) // true
isNull(undefined) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.null(null) // true
is.null(undefined) // false
```

## 行为说明

- 仅当值的运行时类型为 `null` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-null.ts`。

## 适用场景

- 区分 `null` 和 `undefined`。
- 处理可空值时显式分支判断。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
