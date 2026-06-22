# 快速开始

## 安装

```bash
pnpm install
```

## 包结构

- `packages/components`：单个基础组件。
- `packages/modules`：组合模块与高层封装。
- `packages/utils`：公共工具函数。
- `packages/ui`：最终对外发布入口。

## 导入示例

```ts
import { BzButton, getDataType, is } from 'bzsh-ui'
```

## 本地开发

```bash
pnpm dev
```

## 文档开发

```bash
pnpm dev:docs
```

## 新增能力

```bash
pnpm component button
pnpm module form
pnpm utils is-string
```
