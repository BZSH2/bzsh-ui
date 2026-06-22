# isNumber

`isNumber` 用于判断一个值是否为有效数字。

## 签名

```ts
function isNumber(value: unknown): value is number
```

## 示例

```ts
import { isNumber } from '@bzsh-ui/utils'

isNumber(1) // true
isNumber(Number.NaN) // false
isNumber('1') // false
```

## 行为说明

- 仅当值的类型为 `number` 时返回 `true`。
- `NaN` 会被判定为无效数字，因此返回 `false`。

## 适用场景

- 组件 props 的运行时类型守卫。
- 工具函数内部的输入校验。
