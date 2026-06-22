# isDate

`isDate` 用于判断一个值是否为 `Date` 实例。

## 签名

```ts
function isDate(value: unknown): value is Date
```

## 示例

```ts
import { isDate } from 'bzsh-ui'

isDate(new Date()) // true
isDate(Date.now()) // false
```

也可以使用聚合形式：

```ts
import { is } from 'bzsh-ui'

is.date(new Date()) // true
is.date(Date.now()) // false
```

## 行为说明

- 仅当值的运行时类型为 `date` 时返回 `true`。
- 当前源码位于 `packages/utils/type-guards/is-date.ts`。

## 适用场景

- 日期格式化前做输入校验。
- 区分时间戳与 `Date` 实例。

## 继续阅读

- [类型判断](./)
- [getDataType](../type-utils/get-data-type)
