# isBigInt

`isBigInt` 用于判断一个值是否为 `bigint`。

## 签名

```ts
function isBigInt(value: unknown): value is bigint
```

## 示例

```ts
import { isBigInt } from 'bzsh-ui'

isBigInt(1n) // true
isBigInt(1) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.bigInt(1n) // true
is.bigInt(1) // false
```

## 行为说明

- 仅当值的运行时类型为 `bigint` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-big-int.ts`。

## 适用场景

- 处理大整数输入前做类型判断。
- 区分 `number` 与 `bigint`。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
