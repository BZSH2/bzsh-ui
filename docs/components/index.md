# Components 组件总览

`components` 目录承载单个基础组件，每个目录对应一个可以独立安装和导出的原子组件。

## 当前包含

- `BzButton`：按钮组件，负责常见点击操作。
- `BzScroll`：滚动容器组件，负责基础滚动区域承载。

## 开发约定

- 新增单个组件时使用 `pnpm component <name>`。
- 组件源码放在 `packages/components/<name>/`。
- 新增或删除组件后执行 `pnpm sync:components` 同步聚合入口和默认安装列表。

## 继续阅读

- [Button 按钮](./button)
- [Scroll 滚动容器](./scroll)
