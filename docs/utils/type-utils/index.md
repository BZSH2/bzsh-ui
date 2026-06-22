# 类型获取

`type-utils` 目录用于承载底层类型工具，对应源码目录 `packages/utils/type-utils/`。

当前这一层的职责很单一：统一把任意输入值转换为稳定的运行时类型名称，供上层 `is.xxx` 与 `isXxx` 继续复用。

## 当前内容

- [getDataType](./get-data-type)

## 推荐方式

- 需要拿到明确的类型名称时，使用 `getDataType()`。
- 需要直接写条件判断时，优先切到 [type-guards](../type-guards/) 使用 `is.xxx` 或 `isXxx`。

## 示例

```ts
import { getDataType } from 'bzsh-ui'

getDataType('demo') // 'string'
getDataType([]) // 'array'
getDataType(new Date()) // 'date'
```

## 继续阅读

- [getDataType](./get-data-type)
- [type-guards](../type-guards/)
- [Utils 工具函数](../)
