# 代码风格规范

## 注释规范

### 必须添加注释的地方

1. **导出函数**：所有 export 的函数都需要添加 JSDoc 注释
2. **导出类型**：所有 export 的 interface/type 需要添加注释
3. **复杂逻辑**：有业务含义或复杂算法的代码块
4. **配置文件常量**：重要的配置项说明

### 注释风格

- 使用 JSDoc 格式（`/** ... */`）
- 中文注释（与项目语言一致）
- 包含：
  - 功能说明
  - 参数说明（@param）
  - 返回值说明（@returns）
  - 示例（可选）

### 示例

```typescript
/**
 * 将 kebab-case 字符串转换为 PascalCase
 * @param kebabName kebab-case 格式的字符串
 * @returns PascalCase 格式的字符串
 */
function toPascalCase(kebabName: string): string {
  return kebabName
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
}
```

## TypeScript 规范

- 优先使用 `interface` 而非 `type`，除非需要联合类型
- 公共 API 必须有类型定义
- 函数参数和返回值必须标注类型
- 使用 `readonly` 修饰不可变数据

## 文件组织

- 一个文件一个主要职责
- 工具函数放在 `packages/utils/` 目录
- 组件放在 `packages/components/` 目录
- 业务配置放在 `tooling/config/` 目录
- 脚本放在 `tooling/scripts/` 或 `scripts/` 目录

## 命名规范

| 类型           | 规范                 | 示例           |
| -------------- | -------------------- | -------------- |
| 组件文件夹     | kebab-case           | `date-picker/` |
| 组件类名       | PascalCase + Bz 前缀 | `BzDatePicker` |
| 工具函数       | camelCase            | `isNumber`     |
| 常量           | UPPER_SNAKE_CASE     | `MAX_LENGTH`   |
| CSS 类名       | kebab-case + bz 前缀 | `bz-button`    |
| 文件名（工具） | kebab-case           | `is-number.ts` |
