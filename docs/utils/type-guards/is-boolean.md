# isBoolean

`isBoolean` 用于判断一个值是否为布尔值。

## 签名

```ts
function isBoolean(value: unknown): value is boolean
```

## 示例

```ts
import { isBoolean } from 'bzsh-ui'

isBoolean(true) // true
isBoolean(0) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.boolean(false) // true
is.boolean(0) // false
```

## 行为说明

- 仅当值的运行时类型为 `boolean` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-boolean.ts`。

## 适用场景

- 布尔型配置项校验。
- 区分真假值和真正的布尔值。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
