# isObject

`isObject` 用于判断一个值是否为对象。

## 签名

```ts
function isObject(value: unknown): value is Record<PropertyKey, unknown>
```

## 示例

```ts
import { isObject } from 'bzsh-ui'

isObject({}) // true
isObject([]) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.object({ demo: true }) // true
is.object([]) // false
```

## 行为说明

- 仅当值的运行时类型为 `object` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-object.ts`。

## 适用场景

- 需要确认值是否为对象类型。
- 作为更细粒度对象判断的前置条件。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
