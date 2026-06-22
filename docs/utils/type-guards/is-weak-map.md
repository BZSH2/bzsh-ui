# isWeakMap

`isWeakMap` 用于判断一个值是否为 `WeakMap` 实例。

## 签名

```ts
function isWeakMap(value: unknown): value is WeakMap<object, unknown>
```

## 示例

```ts
import { isWeakMap } from 'bzsh-ui'

isWeakMap(new WeakMap()) // true
isWeakMap(new Map()) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.weakMap(new WeakMap()) // true
is.weakMap(new Map()) // false
```

## 行为说明

- 仅当值的运行时类型为 `weakmap` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-weak-map.ts`。

## 适用场景

- 处理弱引用映射结构前做判断。
- 区分 `Map` 与 `WeakMap`。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
