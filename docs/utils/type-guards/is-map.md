# isMap

`isMap` 用于判断一个值是否为 `Map` 实例。

## 签名

```ts
function isMap(value: unknown): value is Map<unknown, unknown>
```

## 示例

```ts
import { isMap } from 'bzsh-ui'

isMap(new Map()) // true
isMap({}) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.map(new Map()) // true
is.map({}) // false
```

## 行为说明

- 仅当值的运行时类型为 `map` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-map.ts`。

## 适用场景

- 处理键值映射结构前做类型判断。
- 区分普通对象与 `Map`。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
