# isPromise

`isPromise` 用于判断一个值是否为 `Promise` 实例。

## 签名

```ts
function isPromise(value: unknown): value is Promise<unknown>
```

## 示例

```ts
import { isPromise } from 'bzsh-ui'

isPromise(Promise.resolve()) // true
isPromise({ then() {} }) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.promise(Promise.resolve(1)) // true
is.promise({ then() {} }) // false
```

## 行为说明

- 仅当值的运行时类型为 `promise` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-promise.ts`。

## 适用场景

- 异步流程分支判断。
- 区分真正的 Promise 与普通 thenable。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
