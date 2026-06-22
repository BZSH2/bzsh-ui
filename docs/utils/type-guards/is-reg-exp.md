# isRegExp

`isRegExp` 用于判断一个值是否为 `RegExp` 实例。

## 签名

```ts
function isRegExp(value: unknown): value is RegExp
```

## 示例

```ts
import { isRegExp } from 'bzsh-ui'

isRegExp(/demo/) // true
isRegExp('demo') // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.regExp(/demo/u) // true
is.regExp('demo') // false
```

## 行为说明

- 仅当值的运行时类型为 `regexp` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-reg-exp.ts`。

## 适用场景

- 处理规则匹配对象前做类型判断。
- 区分字符串模式与正则实例。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
