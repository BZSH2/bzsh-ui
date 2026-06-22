# isWeakSet

`isWeakSet` 用于判断一个值是否为 `WeakSet` 实例。

## 签名

```ts
function isWeakSet(value: unknown): value is WeakSet<object>
```

## 示例

```ts
import { isWeakSet } from 'bzsh-ui'

isWeakSet(new WeakSet()) // true
isWeakSet(new Set()) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.weakSet(new WeakSet()) // true
is.weakSet(new Set()) // false
```

## 行为说明

- 仅当值的运行时类型为 `weakset` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-weak-set.ts`。

## 适用场景

- 处理弱引用集合前做判断。
- 区分 `Set` 与 `WeakSet`。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
