# isString

`isString` 计划用于判断一个值是否为字符串类型。

## 当前状态

当前实现仍是脚手架占位函数，调用时会直接抛出错误：

```ts
import { isString } from '@bzsh-ui/utils'

isString('demo') // throws Error
```

## 原因

- `pnpm utils <name>` 当前生成的是最小占位模板。
- 新增工具函数后，需要继续补完真实实现和测试。

## 建议

- 在正式对外暴露前，为 `packages/utils/type/is-string.ts` 补上真实判断逻辑。
- 补充对应 Vitest 用例后，再把本文档改成稳定 API 说明。
