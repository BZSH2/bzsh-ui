# Utils 工具函数

`utils` 目录承载与组件无强耦合的公共工具函数，主要服务于运行时判断、数据处理和跨包复用场景。

## 当前导出

- `isNumber`
- `isString`

## 使用方式

```ts
import { isNumber, isString } from 'bzsh-ui'
```

也可以在工程内直接从工具包引用：

```ts
import { isNumber, isString } from '@bzsh-ui/utils'
```

## 开发约定

- 新增工具函数使用 `pnpm utils <name>`。
- 源码文件放在 `packages/utils/` 下，由 `packages/utils/index.ts` 统一导出。
- 如果工具函数具备明确输入输出语义，优先补充 Vitest 用例。

## 继续阅读

- [isNumber](./is-number)
- [isString](./is-string)
