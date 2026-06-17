# bzsh-ui Architecture

## 目标

这份文档用于说明当前仓库的目录职责、任务分层和发布链路，帮助后续维护时避免把命令、配置和业务代码再次耦合在一起。

当前仓库已经按以下原则收敛：

- `apps/*` 负责运行态和文档站点。
- `packages/*` 负责组件库源码、内部工具和发布产物。
- `tooling/config/*` 负责共享配置常量。
- `tooling/scripts/*` 负责把共享配置转换成可执行命令。
- 根 `package.json` 只保留稳定入口，不再承担复杂编排逻辑。

## 目录分层

### `apps`

- `apps/docs`
  - VitePress 文档站点。
  - 对外提供 `dev/build/preview` 标准脚本。
  - 产物目录为 `apps/docs/.vitepress/dist`。
- `apps/play`
  - 本地调试 playground。
  - 用于联调组件和快速验证运行效果。
  - 对外提供 `dev/build/preview` 标准脚本。

### `packages`

- `packages/components`
  - 组件源码聚合层。
  - 负责导出所有组件入口。
  - 当前已具备独立 `lint/typecheck/test` 能力。
- `packages/internal`
  - 内部安装器和非公开运行时工具。
  - 例如 `with-install` 这类不直接面向使用者的能力。
- `packages/utils`
  - 公共工具函数。
  - 当前已具备独立 `lint/typecheck/test` 能力。
- `packages/theme-chalk`
  - 主题样式和 SCSS 聚合入口。
  - 样式检查由包级 `stylelint` 承担。
- `packages/ui`
  - 对外发布包 `bzsh-ui`。
  - 负责组装组件、默认安装列表和最终打包产物。

### `tooling`

- `tooling/config`
  - 放置共享常量和任务映射。
  - 当前核心文件：
    - `lint.mjs`
    - `workspace-tasks.ts`
    - `root-tasks.ts`
- `tooling/scripts`
  - 放置共享任务执行器和生成脚本。
  - 当前核心文件：
    - `run-root-lint.ts`
    - `run-workspace-task.ts`
    - `run-root-task-group.ts`
    - `sync-components.ts`
    - `component-registry.ts`

## 任务分层

当前任务系统分为三层，自上而下职责越来越具体。

### 1. 根入口层

根 `package.json` 只暴露稳定命令名，例如：

- `pnpm dev`
- `pnpm dev:docs`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm check`
- `pnpm release:verify`

这一层只提供入口，不再直接维护复杂的 `pnpm --filter` 或多段 `&&` 串联。

### 2. 根组合任务层

根组合关系定义在 `tooling/config/root-tasks.ts`。

当前关键任务：

- `build`
  - `build:packages -> build:docs`
- `lint`
  - `lint:packages -> lint:root`
- `typecheck`
  - `typecheck:packages -> typecheck:root`
- `test`
  - `test:packages`
- `check`
  - `lint -> typecheck -> test -> build`
- `release:verify`
  - `check -> format:check`

执行器为 `tooling/scripts/run-root-task-group.ts`。

它的职责是：

- 按顺序执行根任务组。
- 某一步失败时立即退出。
- 保持根入口层不关心具体编排细节。

### 3. Workspace 叶子任务层

workspace 叶子任务定义在 `tooling/config/workspace-tasks.ts`。

当前关键任务：

- `packages:build`
- `packages:lint`
- `packages:typecheck`
- `packages:test`
- `docs:dev`
- `docs:build`
- `docs:preview`
- `play:dev`
- `play:build`
- `play:preview`

执行器为 `tooling/scripts/run-workspace-task.ts`。

它的职责是：

- 承担 `pnpm --filter` 和 `pnpm -r` 的实际调用。
- 把包范围、app 名称和执行方式集中到配置文件。
- 支持向下透传参数，例如：
  - `pnpm dev -- --host 127.0.0.1 --port 4273`
  - `pnpm dev:docs -- --host 127.0.0.1 --port 4274`

## Lint 分层

Lint 链路目前分成两条：

### 根级全量检查

根级 lint 负责非 `packages/**` 的全量检查，入口包括：

- `pnpm lint`
- `pnpm lint:root`
- `pnpm lint:eslint`
- `pnpm lint:stylelint`

相关文件：

- `tooling/config/lint.mjs`
- `tooling/scripts/run-root-lint.ts`

当前设计目标：

- 根级 lint 不重复扫描包级源码。
- 包级 lint 由各自 `package.json` 负责。

### 提交前增量检查

提交前链路由以下文件负责：

- `.husky/pre-commit`
- `lint-staged.config.js`
- `tooling/config/lint.mjs`

当前规则：

- 只处理暂存区文件。
- 会过滤 `dist`、`coverage`、`node_modules`、`apps/docs/.vitepress/cache`、`apps/docs/.vitepress/dist` 等非源码目录。
- `eslint`、`stylelint`、`prettier` 的 staged 行为复用共享配置，而不是在多个文件里重复声明。

## 组件与样式聚合

当前组件元数据不再依赖分散的手工文本替换，主要通过生成脚本收敛：

- `tooling/scripts/component-registry.ts`
- `tooling/scripts/sync-components.ts`

生成目标包括：

- `packages/components/index.ts`
- `packages/ui/defaults.ts`
- `packages/theme-chalk/src/index.scss`

这意味着新增、删除组件时，优先维护组件目录和生成入口，不要再手工同步多个聚合文件。

## 发布与 CI

### 发布前验证

统一入口：

- `pnpm check`
- `pnpm release:verify`

语义约定：

- `check` 用于全量工程校验。
- `release:verify` 用于发布前校验，比 `check` 多一层 `format:check`。

### Release Workflow

`.github/workflows/release.yml` 当前遵循以下顺序：

1. 安装依赖。
2. 执行 `pnpm release:verify`。
3. 自动补 changeset。
4. 执行 `pnpm version-packages`。
5. 执行 `pnpm release`。

这样 workflow 只负责平台步骤和发布凭证，校验逻辑统一下沉到仓库任务层。

### Docs Workflow

`.github/workflows/deploy-docs.yml` 当前约定：

- 监听 `apps/docs/**` 和 `packages/**` 变更。
- 通过 `pnpm run build:docs` 构建文档。
- 从 `apps/docs/.vitepress/dist` 打包并部署。

## 维护约定

后续继续演进时，尽量遵守以下约定：

### 新增或调整脚本

- 如果只是根脚本组合关系变化，优先改 `tooling/config/root-tasks.ts`。
- 如果只是 workspace 范围或 app/package 名称变化，优先改 `tooling/config/workspace-tasks.ts`。
- 如果只是 lint 范围或 staged 策略变化，优先改 `tooling/config/lint.mjs`。
- 不要把复杂编排重新写回根 `package.json`。

### 新增包或应用

- 新增 `packages/*` 时，先补齐包自己的 `scripts`。
- 新增 `apps/*` 时，优先提供标准 `dev/build/preview`。
- 需要接入根任务时，再把它们注册到 `workspace-tasks.ts` 或 `root-tasks.ts`。

### 新增发布或校验流程

- 先判断它是叶子任务还是组合任务。
- 叶子任务放 `workspace-tasks.ts` 或单独脚本。
- 组合任务放 `root-tasks.ts`。
- workflow 里尽量调用仓库已有任务名，而不是复制一套命令。

## 当前结论

当前仓库的核心架构不是“所有脚本都变少”，而是“脚本的职责边界更稳定”：

- 目录职责清楚。
- 根入口稳定。
- 组合关系集中。
- workspace 过滤集中。
- lint 规则与 staged 策略集中。
- workflow 尽量复用仓库任务，而不是自成体系。

如果后续需要继续优化，优先级通常应放在：

1. 组件生成和注册流程是否还能继续收口。
2. 包级 `package.json` 模板是否还能继续标准化。
3. CI 是否需要新增更多场景，再决定是否抽 reusable workflow。
