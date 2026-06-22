# 项目结构规范

## 目录职责

### `docs/` 与 `play/`

根级应用目录。

- `docs/`: VitePress 文档站点
- `play/`: 本地调试 playground
- 当某个源码域已经拆出清晰子目录时，文档目录优先保持相近层级，尽量做到结构拉齐

### `packages/`

组件库源码、内部工具和发布产物。

- `packages/components/`: 组件源码聚合层
- `packages/internal/`: 内部工具，如 `with-install`
- `packages/utils/`: 公共工具函数
- `packages/theme-chalk/`: 主题样式
- `packages/ui/`: 对外发布包

### `tooling/`

共享配置和脚本。

- `tooling/config/`: 共享配置常量
- `tooling/scripts/`: 任务执行器

### `scripts/`

用户级命令脚本。

- `create-component.ts`: 创建组件
- `delete-component.ts`: 删除组件
- `create-utils.ts`: 创建工具函数
- `create-changeset.ts`: 创建 changeset

### `.agent/`

Agent 规则文件目录。

- `core/`: 通用规范
- `domains/`: 领域规则

### `.changeset/`

Changesets 配置文件目录。

### `.github/`

GitHub 相关配置，如 workflows。

### `.husky/`

Git hooks 配置。

## 修改规则

### 修改任务配置

- 任务组合关系变化，修改 `tooling/config/root-tasks.ts`
- workspace 范围变化，修改 `tooling/config/workspace-tasks.ts`
- lint 规则变化，修改 `tooling/config/lint.ts`
- 不要修改根 `package.json` 中的复杂编排

### 新增包或应用

- 新增 `packages/*` 时，先补齐包自己的 `scripts`
- 新增 `docs/` 或 `play/` 这类根级应用时，优先提供标准 `dev/build/preview`
- 需要接入根任务时，注册到 `workspace-tasks.ts` 或 `root-tasks.ts`

### 配置 lint 脚本

新增或修改包的 lint 脚本时，必须使用 glob 模式：

```json
{
  "scripts": {
    "lint": "eslint \"**/*.ts\""
  }
}
```

详见 [lint-config.md](./lint-config.md)。

### 新增 Agent 规则

- 通用规则放在 `.agent/core/`
- 组件、工具函数等领域规则放在 `.agent/domains/<name>/`
- 更新 [.agent/README.md](../README.md) 的索引
- 保持单一职责原则

## 禁止事项

- 不要把复杂编排写回根 `package.json`
- 不要在 `packages/`、`tooling/` 等源码目录放置项目级文档
- 不要把 Agent 规则放在根目录
- 不要在 lint 脚本中手动列出文件，必须使用 glob 模式
