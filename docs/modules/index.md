# Modules 组合模块

`modules` 目录用于承载由多个基础组件组合而成的模块能力，适合放置表单域、数据面板、复合交互块这类高层封装。

## 当前状态

当前仓库已经完成 `packages/modules` 的工程接线，包括：

- `@bzsh-ui/modules` 路径别名与聚合导出。
- `packages/ui` 对模块的统一导出与默认安装支持。
- `pnpm module <name>` 组合模块创建脚手架。

## 使用方式

```bash
pnpm module form
```

创建后会生成：

- `packages/modules/form/index.ts`
- `packages/modules/form/README.md`

## 开发约定

- 组合模块源码放在 `packages/modules/<name>/`。
- 模块入口建议复用 `withInstall`，保持和组件层一致的安装方式。
- 新增模块后会自动更新 `packages/modules/index.ts` 与 `packages/ui/defaults.ts`。

## 后续补充

当前文档站还没有内置的真实模块示例页；当仓库中出现实际模块后，可以继续在本目录补充对应文档。
