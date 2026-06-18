# 开发工作流规范

## 提交规范

### 提交信息格式

使用 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档变更
- `style`: 代码格式变更（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工程依赖/工具
- `ci`: CI 配置
- `release`: 发版提交
- `revert`: 回退
- `build`: 打包构建

### 提交工具

- 使用 `pnpm cz` 命令（基于 git-cz）进行交互式提交
- 提交前会自动运行 lint-staged 检查

### cz 工具配置

`git-cz` 通过查找特定名称的配置文件来加载自定义配置：

**配置文件查找顺序**（从项目根目录开始）：

1. `.git-cz.json`（推荐）
2. `changelog.config.js`
3. `changelog.config.cjs`
4. `changelog.config.json`

**注意**：

- 配置文件名是 **`.git-cz.json`**（以点开头），不是 `git-cz.json`
- `.czrc` 文件不是 git-cz 的配置文件，是 commitizen 的配置文件

**配置示例**（`.git-cz.json`）：

```json
{
  "disableEmoji": false,
  "list": ["feat", "fix", "docs", "style", "refactor"],
  "maxMessageLength": 64,
  "minMessageLength": 3,
  "questions": ["type", "scope", "subject", "body"],
  "types": {
    "feat": {
      "description": "Features | 新功能",
      "emoji": "✨",
      "value": "feat"
    }
  }
}
```

**配置修改后无需重新安装依赖**，重新运行 `pnpm cz` 即可生效。

## 开发流程

### 新增组件

1. 使用 `pnpm component <name>` 创建组件
2. 编辑组件代码和样式
3. 运行 `pnpm test` 确保测试通过
4. 运行 `pnpm lint` 确保代码规范
5. 提交代码

### 修改工具函数

1. 直接编辑 `packages/utils/` 下的文件
2. 运行 `pnpm test:packages` 运行测试
3. 提交代码

### 修改配置

1. 编辑对应的配置文件
2. 运行 `pnpm typecheck` 确保类型正确
3. 运行 `pnpm lint` 确保规范
4. 提交代码

### 修改文档

1. 编辑对应的 `.md` 文件
2. 如果新增了项目级文档，在 `README.md` 中添加链接
3. 如果新增了 Agent 规则，在 `.agent/README.md` 中添加条目
4. 提交代码

## 分支策略

- `main`: 主分支，稳定版本
- `feat/*`: 功能分支
- `fix/*`: 修复分支

## 发布流程

1. 在功能分支完成开发
2. 创建 PR 到 `master`
3. 在本地运行 `pnpm version-packages` 更新需要发布的包版本
4. 提交版本文件并合并到 `master`
5. 为这次发布创建 Git tag 和 GitHub Release
6. CI 在 GitHub Release 创建后执行发布

## CI/CD

- `.github/workflows/release.yml`: 发布流程
- `.github/workflows/deploy-docs.yml`: 文档部署

### Release Workflow

- 发布阶段不再重复执行 `pnpm lint`
- 发布阶段不再执行 `pnpm typecheck`
- 发布阶段不再执行 `pnpm test`
- 发布阶段不再执行 `pnpm format:check`
- `lint` 放在开发者本地提交阶段通过 `lint-staged` 执行
- 版本号更新必须由开发者在本地执行 `pnpm version-packages`
- Release Action 改为在 GitHub Release 创建后触发
- Release Action 只保留 `build` 和 `pnpm release`

## Lint 流程

### 提交前

- Husky 在 commit 时自动运行 lint-staged
- 只检查暂存区的文件

### 全量检查

- `pnpm lint`: 检查整个项目
- `pnpm lint:fix`: 自动修复可修复的问题
