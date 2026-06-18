# 开发工作流规范

## 提交规范

### 提交信息格式

使用 Conventional Commits 规范：

```text
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档变更
- `style`: 代码格式变更
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建、工程依赖、工具
- `ci`: CI 配置
- `release`: 发版提交
- `revert`: 回退
- `build`: 打包构建

### 提交工具

- 使用 `pnpm cz` 命令进行交互式提交
- 提交前会自动运行 `lint-staged`

## 开发流程

### 新增组件

1. 使用 `pnpm component <name>` 创建组件
2. 编辑组件代码和样式
3. 运行 `pnpm test`
4. 运行 `pnpm lint`
5. 提交代码

### 修改工具函数

1. 直接编辑 `packages/utils/` 下的文件
2. 运行 `pnpm test:packages`
3. 提交代码

### 修改配置

1. 编辑对应配置文件
2. 运行 `pnpm typecheck`
3. 运行 `pnpm lint`
4. 提交代码

### 修改文档

1. 编辑对应 `.md` 文件
2. 如果新增了项目级文档，在 `README.md` 中添加链接
3. 如果新增了 Agent 规则，在 [.agent/README.md](../README.md) 中添加条目
4. 提交代码

## 分支策略

- `main`: 主分支，稳定版本
- `feat/*`: 功能分支
- `fix/*`: 修复分支

## 发布流程

1. 在功能分支完成开发
2. 创建 PR 到 `master`
3. 在本地运行 `pnpm ship`
4. 版本提交推送到 `master`
5. `Create GitHub Release` workflow 自动创建 Release
6. `Publish to NPM registry` workflow 自动构建并发布

## CI/CD

- `.github/workflows/auto-release.yml`: 自动创建 GitHub Release
- `.github/workflows/publish-npm.yml`: 发布 npm 包
- `.github/workflows/deploy-docs.yml`: 文档部署

### Release Workflow

- 发布阶段只保留 `build` 和 `pnpm release`
- `lint`、`typecheck`、`test` 不在发布 workflow 中重复执行
- 版本号更新由 `pnpm ship` 驱动
- GitHub Release 和 npm 发布由 CI 自动串联

## Lint 流程

### 提交前

- Husky 在 commit 时自动运行 `lint-staged`
- 只检查暂存区文件

### 全量检查

- `pnpm lint`: 检查整个项目
- `pnpm lint:fix`: 自动修复可修复的问题
