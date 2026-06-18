# Lint 配置规范

## 核心原则

本项目的 lint 配置遵循**自动化优先**原则，避免手动维护文件列表导致遗漏。

## 包级 lint 配置

各包的 `package.json` 中 `lint` 脚本**必须使用 glob 模式**：

### 标准配置

```json
{
  "scripts": {
    "lint": "eslint \"**/*.ts\""
  }
}
```

### 不同包的配置

| 包类型            | 推荐配置                          | 说明                         |
| ----------------- | --------------------------------- | ---------------------------- |
| 纯 TypeScript 包  | `eslint \"**/*.ts\"`              | 如 `internal`、`utils`、`ui` |
| 包含 Vue 组件的包 | `eslint \"**/*.ts\" \"**/*.vue\"` | 如 `components`              |
| 样式包            | `stylelint \"src/**/*.scss\"`     | 如 `theme-chalk`             |

### 配置优势

- ✅ **自动发现**：新增文件无需修改 `package.json`
- ✅ **避免遗漏**：所有匹配文件都会被检查
- ✅ **维护简单**：不需要手动同步文件列表
- ✅ **团队友好**：减少人为错误

## 反模式（禁止）

### ❌ 手动列出文件

```json
// 不要这样做
{
  "scripts": {
    "lint": "eslint index.ts with-install.ts button/index.ts button/props.ts"
  }
}
```

**问题**：

- 新增文件后必须手动修改 `package.json`
- 容易遗漏，导致新文件未通过 lint 检查
- 删除文件后忘记清理，导致 lint 报错
- 维护成本高

## 特殊情况处理

### 排除特定文件或目录

如果需要排除某些文件，使用 `.eslintignore` 或 ESLint 配置的 `ignores` 字段：

```javascript
// eslint.config.ts
{
  ignores: ['**/dist/**', '**/node_modules/**']
}
```

### 包含其他文件类型

如果需要检查其他类型文件，扩展 glob 模式：

```json
{
  "lint": "eslint \"**/*.{ts,js,vue}\""
}
```

## 引号注意事项

glob 模式中的 `**` 必须用引号包裹：

```json
// 正确
"lint": "eslint \"**/*.ts\""

// 错误（shell 会展开 **）
"lint": "eslint **/*.ts"
```

## 检查清单

新增或修改包的 lint 配置时，确认以下事项：

- [ ] 使用 glob 模式而非手动列出文件
- [ ] glob 模式用引号包裹
- [ ] Vue 组件包同时匹配 `.ts` 和 `.vue`
- [ ] 如有特殊排除需求，配置 `.eslintignore` 而非修改脚本
- [ ] 运行 `pnpm lint:packages` 验证配置正确
