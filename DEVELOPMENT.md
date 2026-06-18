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

当前仓库的 npm 发布不是在 push 后立即触发，而是在 **创建 GitHub Release** 后由 CI 自动执行。

推荐优先使用一键发布脚本：

```bash
pnpm ship
```

`pnpm ship` 的默认行为如下：

- 如果仓库里存在待发布的 `.changeset/*.md` 文件，会先自动执行 `pnpm version-packages` 更新版本号
- 如果没有待发布 changeset，则直接基于当前版本创建 tag 和 GitHub Release

如果本机没有安装 `GitHub CLI (gh)`，脚本会自动退化为：

- 先推送 tag
- 再打开 GitHub 的新建 Release 页面
- 你只需要在浏览器里点一次 `Publish release`

如果你希望从 changeset 开始整套自动发版，也可以传参数：

```bash
pnpm ship patch "修复按钮样式问题"
```

这条命令会自动完成以下步骤：

- 创建 changeset
- 执行 `pnpm version-packages`
- 提交版本变更
- 推送到 `master`
- 创建并推送 tag
- 创建 GitHub Release
- 触发 CI 自动发布到 npm

常用参数示例：

```bash
pnpm ship
pnpm ship minor "新增表单组件"
pnpm ship minor "新增表单组件" --version 0.2.0
pnpm ship patch "修复发布流程" --dry-run
pnpm ship --skip-changeset
```

也保留了兼容别名：

```bash
pnpm tag
```

但更推荐使用 `pnpm ship`，因为这个命令做的不只是打 tag，而是完整执行一整套发布流程。

- `--dry-run`：只打印将要执行的命令，不实际修改仓库或远程状态
- `--skip-changeset`：跳过自动创建 changeset，适合你已经手动准备好 changeset 的情况
- `--version`：显式指定目标版本，脚本会校验 `pnpm version-packages` 的结果必须与该版本完全一致
- 运行前请确认当前分支是干净的 `master`，并且本机已完成 `gh auth login`
- 脚本会自动读取当前包版本和仓库最新 `v*` tag，并校验新 tag 与当前版本一致且版本号递增
- 脚本会自动 `fetch` 并检查本地 `master` 与 `origin/master` 是否完全一致，避免基于过期代码发版
- 脚本还会检查远程同名 tag 与 GitHub Release 是否已存在，避免重复发版

如果你想手动执行完整流程，也可以按下面的 SOP 操作：

#### 1. 创建 changeset

如果这次改动需要发版，先在本地创建 changeset：

```bash
pnpm changeset
```

如果你已经有自定义自动生成逻辑，也可以使用：

```bash
pnpm changeset:auto
```

#### 2. 在本地更新版本号

确认 changeset 无误后，在本地执行：

```bash
pnpm version-packages
```

这一步会更新相关包的版本号和 changelog。

#### 3. 提交版本变更并推送

```bash
git add .
git commit -m "chore: release v0.1.0"
git push origin master
```

#### 4. 为本次发布创建 tag 并推送

把下面的 `v0.1.0` 替换成你这次实际要发布的版本号：

```bash
git tag v0.1.0
git push origin v0.1.0
```

#### 5. 创建 GitHub Release

方式一：使用 GitHub CLI

```bash
gh release create v0.1.0 --title "v0.1.0" --notes "release v0.1.0"
```

方式二：使用 GitHub 网页

1. 打开仓库的 `Releases` 页面
2. 点击 `Draft a new release`
3. 选择刚刚推送的 tag，例如 `v0.1.0`
4. 填写标题和发布说明
5. 点击 `Publish release`

#### 6. 等待 CI 自动发布到 npm

当 GitHub Release 创建成功后，[release.yml](./.github/workflows/release.yml) 会自动触发，并执行：

```bash
pnpm build
pnpm release
```

#### 发布前检查

发布前建议确认以下几点：

- 需要发布的包版本号已经由 `pnpm version-packages` 正确更新
- npm 上还不存在相同版本号
- 仓库 Secrets 中已正确配置 `BZSH_UI_TOKEN`
- 本地代码和远程 `master` 保持一致

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
