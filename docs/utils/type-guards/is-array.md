# isArray

`isArray` 用于判断一个值是否为数组。

## 签名

```ts
function isArray(value: unknown): value is unknown[]
```

## 示例

```ts
import { isArray } from 'bzsh-ui'

isArray([]) // true
isArray({}) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.array([]) // true
is.array({}) // false
```

## 行为说明

- 仅当值的运行时类型为 `array` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-array.ts`。

## 适用场景

- 需要判断一个值是否可以按数组处理。
- 在参数校验中区分对象与数组。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
