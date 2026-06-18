/**
 * 根任务组配置
 * 定义了各个任务组包含的具体任务
 */
export const rootTaskGroups: Record<string, string[]> = {
  /**
   * 完整构建任务，包含组件包和文档
   */
  'build': ['build:packages', 'build:docs'],
  /**
   * 仅构建组件库任务
   */
  'build:lib': ['build:packages'],
  /**
   * 完整检查任务，包含 lint、类型检查、测试和构建
   */
  'check': ['lint', 'typecheck', 'test', 'build'],
  /**
   * lint 任务，包含包和根目录的 lint
   */
  'lint': ['lint:packages', 'lint:root'],
  /**
   * 自动修复 lint 问题任务
   */
  'lint:fix': ['lint:eslint:fix', 'lint:stylelint:fix'],
  /**
   * 根目录 lint 任务
   */
  'lint:root': ['lint:eslint', 'lint:stylelint'],
  /**
   * 测试任务
   */
  'test': ['test:packages'],
  /**
   * 类型检查任务
   */
  'typecheck': ['typecheck:packages', 'typecheck:root'],
}
