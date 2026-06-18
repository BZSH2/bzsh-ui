# 开发指南

> 创建时间: 2026-06-18

## 目录

- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [常用命令](#常用命令)
- [开发流程](#开发流程)
- [测试规范](#测试规范)
- [常见问题](#常见问题)

## 环境要求

- Node.js 18+
- pnpm 10+
- Git

## 快速开始

```bash
# 克隆项目
git clone <repository-url>
cd bzsh-ui

# 安装依赖
pnpm install

# 初始化 husky
pnpm prepare

# 启动开发服务
pnpm dev

# 构建项目
pnpm build
```

## 项目结构

```
bzsh-ui/
├── apps/          # 应用层
├── packages/      # 包层
├── tooling/       # 工具配置
├── scripts/       # 脚本
├── tests/         # 测试
├── .agent/        # Agent 规则
└── ...
```

详细说明见 [ARCHITECTURE.md](./ARCHITECTURE.md)

## 常用命令

### 开发命令

```bash
pnpm dev          # 启动 playground
pnpm dev:docs     # 启动文档站点
pnpm build        # 构建整个项目
pnpm build:lib    # 仅构建组件库
```

### 代码质量

```bash
pnpm lint         # 运行所有 lint 检查
pnpm lint:fix     # 自动修复 lint 问题
pnpm typecheck    # 运行类型检查
pnpm test         # 运行测试
pnpm check        # 完整检查（lint + typecheck + test + build）
```

### 组件管理

```bash
pnpm component <name>      # 创建新组件
pnpm deleteC <name>        # 删除组件
pnpm utils <name>          # 创建工具函数
pnpm sync:components       # 同步组件注册表
```

### 发布相关

```bash
pnpm changeset             # 创建 changeset
pnpm changesets:au          # 自动创建 changeset
pnpm version-packages      # 更新版本
pnpm release               # 发布
pnpm release:verify        # 发布前验证
```

## 开发流程

### 新增组件

1. **创建组件**

   ```bash
   pnpm component button
   ```

   这会创建：
   - `packages/components/button/` 组件目录
   - 组件文件、props、样式、测试

2. **编辑组件代码**

   ```bash
   # 编辑组件实现
   packages/components/button/src/button.vue

   # 编辑 props
   packages/components/button/props.ts

   # 编辑样式
   packages/components/button/style/index.scss
   ```

3. **编写测试**

   ```bash
   tests/button.spec.ts
   ```

4. **同步组件**

   ```bash
   pnpm sync:components
   ```

5. **验证**

   ```bash
   pnpm typecheck
   pnpm lint
   pnpm test
   ```

6. **提交代码**

   ```bash
   pnpm cz
   ```

### 新增工具函数

```bash
pnpm utils isNumber
```

创建后在 `packages/utils/` 下编辑实现。

### 修改配置

- 修改任务配置 → `tooling/config/`
- 修改 lint 规则 → `tooling/config/lint.ts`
- 修改 TypeScript 配置 → `tsconfig.base.json`

## 测试规范

### 测试位置

- 组件测试：`tests/<component-name>.spec.ts`
- 工具测试：`tests/<util-name>.spec.ts`

### 测试框架

使用 Vitest + Vue Test Utils。

### 测试示例

```typescript
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { BzButton } from '../packages/components'

describe('BzButton', () => {
  it('renders correctly', () => {
    const wrapper = mount(BzButton, {
      props: { label: 'Click me' },
    })
    expect(wrapper.text()).toContain('Click me')
  })
})
```

### 运行测试

```bash
pnpm test                 # 运行所有测试
pnpm test:packages        # 仅运行包的测试
```

## Lint 规范

所有包的 lint 脚本使用 glob 模式自动匹配文件：

```json
{
  "scripts": {
    "lint": "eslint \"**/*.ts\""
  }
}
```

**新增文件后无需手动修改 lint 配置**，会自动被检查。

详见 [.agent/lint-config.md](./.agent/lint-config.md)

## 提交规范

使用 Conventional Commits 规范：

```bash
pnpm cz  # 交互式提交
```

Type 类型：

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档变更
- `style`: 代码格式
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试
- `chore`: 构建/工具
- `ci`: CI 配置

## 常见问题

### Q: 新增的文件没有被 lint 检查？

A: 检查 `package.json` 中的 lint 脚本是否使用了 glob 模式。详见 [lint-config.md](./.agent/lint-config.md)

### Q: 提交时 lint 失败？

A: 运行 `pnpm lint:fix` 自动修复，或手动修复后重新提交。

### Q: 类型错误？

A: 运行 `pnpm typecheck` 查看详细错误，确保类型定义正确。

### Q: 组件未注册？

A: 运行 `pnpm sync:components` 同步组件注册表。

### Q: 如何添加新的 Agent 规则？

A: 在 `.agent/` 目录创建新的规则文件，并在 `.agent/README.md` 中添加条目。详见 [.agent/documentation.md](./.agent/documentation.md)

## 相关资源

- [架构文档](./ARCHITECTURE.md)
- [Agent 规则目录](./.agent/README.md)
- [组件库文档](apps/docs/)
