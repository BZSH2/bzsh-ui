# getDataType

`getDataType` 用于统一获取一个值的运行时数据类型。

它是整组类型工具的基础能力，`is.xxx` 和 `isXxx` 本质上都是在这个方法的结果之上做封装。

## 签名

```ts
function getDataType(value: unknown): string
```

## 实现方式

```ts
Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
```

## 示例

```ts
import { getDataType } from 'bzsh-ui'

getDataType('demo') // 'string'
getDataType(1) // 'number'
getDataType([]) // 'array'
getDataType(null) // 'null'
getDataType(new Date()) // 'date'
```

## 常见返回值

| 输入值              | 返回值        |
| ------------------- | ------------- |
| `'demo'`            | `'string'`    |
| `1`                 | `'number'`    |
| `true`              | `'boolean'`   |
| `null`              | `'null'`      |
| `undefined`         | `'undefined'` |
| `[]`                | `'array'`     |
| `{}`                | `'object'`    |
| `new Date()`        | `'date'`      |
| `/demo/`            | `'regexp'`    |
| `Promise.resolve()` | `'promise'`   |

## 和 is 的关系

```ts
import { getDataType, is } from 'bzsh-ui'

getDataType([]) === 'array' // true
is.array([]) // true
```

`getDataType()` 更适合做统一分支判断，`is.xxx` 更适合直接写条件表达式。

## 适用场景

- 作为所有 `isXxx` 类型判断函数的底层能力。
- 需要统一处理不同输入值的运行时类型时使用。
- 需要在日志、调试或参数校验中输出明确类型名时使用。

## 继续阅读

- [type-guards](../type-guards/)
- [Utils 工具函数](../)
