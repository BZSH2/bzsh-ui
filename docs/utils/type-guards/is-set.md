# isSet

`isSet` 用于判断一个值是否为 `Set` 实例。

## 签名

```ts
function isSet(value: unknown): value is Set<unknown>
```

## 示例

```ts
import { isSet } from 'bzsh-ui'

isSet(new Set()) // true
isSet([]) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.set(new Set([1, 2])) // true
is.set([]) // false
```

## 行为说明

- 仅当值的运行时类型为 `set` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-set.ts`。

## 适用场景

- 处理去重集合前做类型判断。
- 区分数组与集合类型。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
