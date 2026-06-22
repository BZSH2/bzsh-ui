# isSymbol

`isSymbol` 用于判断一个值是否为 `Symbol`。

## 签名

```ts
function isSymbol(value: unknown): value is symbol
```

## 示例

```ts
import { isSymbol } from 'bzsh-ui'

isSymbol(Symbol('demo')) // true
isSymbol('demo') // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.symbol(Symbol.for('demo')) // true
is.symbol('demo') // false
```

## 行为说明

- 仅当值的运行时类型为 `symbol` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-symbol.ts`。

## 适用场景

- 需要判断唯一标识值时使用。
- 区分字符串 key 与 Symbol key。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
