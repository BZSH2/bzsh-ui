# isPlainObject

`isPlainObject` 用于判断一个值是否为普通对象。

## 签名

```ts
function isPlainObject(value: unknown): value is Record<PropertyKey, unknown>
```

## 示例

```ts
import { isPlainObject } from 'bzsh-ui'

isPlainObject({ demo: true }) // true
isPlainObject(new Date()) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.plainObject(Object.create(null)) // true
is.plainObject(new Date()) // false
```

## 行为说明

- 只有原型为 `Object.prototype` 或 `null` 的对象才会返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-plain-object.ts`。

## 适用场景

- 处理配置对象、选项对象时做保护。
- 区分类实例、数组和普通对象。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
