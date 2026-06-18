# 文档管理规则

## 适用范围

本规则适用于项目中所有 Markdown 文档的创建、修改和管理。

## 文档分类

项目中的文档分为三类：

### 1. 项目级文档

- **位置**：项目根目录
- **命名**：UPPER-KEBAB-CASE 格式（如 `ARCHITECTURE.md`、`CHANGELOG.md`）
- **作用**：项目架构、规范、流程等说明
- **示例**：`ARCHITECTURE.md`、`CONTRIBUTING.md`、`DEPLOYMENT.md`

### 2. 组件文档

- **位置**：`apps/docs/components/` 目录
- **命名**：kebab-case 格式（如 `button.md`、`date-picker.md`）
- **作用**：组件的 API、用法示例说明
- **由组件库脚本自动管理**：`pnpm component` 命令会自动创建对应的文档文件

### 3. 指南文档

- **位置**：`apps/docs/guide/` 目录
- **命名**：kebab-case 格式（如 `getting-started.md`、`installation.md`）
- **作用**：教程、使用指南等

## 项目级文档规则

### 命名规范

- 使用 UPPER-KEBAB-CASE 格式
- 文件名应具有描述性，简洁明了
- 必须以 `.md` 结尾

### 链接维护

- 所有项目级文档必须在根目录 `README.md` 的 `## Docs` 部分添加链接
- 链接格式：`- 标题: [文件名.md](./文件名.md)`
- 顺序按字母排序（先 `AGENT` 再 `ARCHITECTURE`）

### 文档结构

每个项目级文档应包含：

- 一级标题（文档名称）
- 概述或简介
- 目录（可选，但建议）
- 主要内容章节

### 示例

新增文档 `DEPLOYMENT.md` 时：

1. 在项目根目录创建 `DEPLOYMENT.md`
2. 编写文档内容
3. 在 `README.md` 的 `## Docs` 部分添加：
   ```
   - 部署指南: [DEPLOYMENT.md](./DEPLOYMENT.md)
   ```

## Agent 规则文档特殊规范

Agent 规则相关文档统一放在 `.agent/` 目录下：

- 不要再创建独立的 `AGENT_RULES.md` 文件
- 所有 Agent 相关规则都在 `.agent/` 目录中维护
- 见 [.agent/README.md](./README.md)

## 禁止事项

- 不要在 `apps/`、`packages/`、`tooling/` 子目录放置项目级文档
- 不要忘记在 `README.md` 中更新文档链接
- 不要将 Agent 规则放在根目录
