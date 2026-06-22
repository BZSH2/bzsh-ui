# isUndefined

`isUndefined` 用于判断一个值是否为 `undefined`。

## 签名

```ts
function isUndefined(value: unknown): value is undefined
```

## 示例

```ts
import { isUndefined } from 'bzsh-ui'

isUndefined(undefined) // true
isUndefined(null) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.undefined(undefined) // true
is.undefined(null) // false
```

## 行为说明

- 仅当值的运行时类型为 `undefined` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-undefined.ts`。

## 适用场景

- 区分未传值和显式传入 `null`。
- 做默认值逻辑前显式判断。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
