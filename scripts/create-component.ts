import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { componentsDir, repoRoot } from '../tooling/config/project-paths'
import { syncComponentRegistry } from '../tooling/scripts/component-registry'

/**
 * 测试文件目录路径
 */
const testsDir = path.join(repoRoot, 'tests')

/**
 * 组件元数据类型
 */
type ComponentMeta = {
  componentName: string
  pascalName: string
  kebabName: string
  cssName: string
}

/**
 * 输出文件类型
 */
type OutputFile = {
  path: string
  content: string
}

/**
 * 打印脚本使用说明
 */
function printUsage(): void {
  console.log(`Usage:
  pnpm component <name> [--dry-run]

Examples:
  pnpm component input
  pnpm component Input
  pnpm component BzInput
  pnpm component date-picker --dry-run`)
}

/**
 * 解析命令行参数
 * @param argv 命令行参数数组
 * @returns 解析后的参数对象
 */
function parseArgs(argv: string[]): { dryRun: boolean; rawName: string } {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    printUsage()
    process.exit(argv.length === 0 ? 1 : 0)
  }

  const dryRun = argv.includes('--dry-run')
  const nameArg = argv.find((arg) => !arg.startsWith('-'))

  if (!nameArg) {
    throw new Error('Missing component name.')
  }

  return {
    dryRun,
    rawName: nameArg.trim(),
  }
}

/**
 * 将输入字符串分割成单词数组
 * @param input 输入字符串
 * @returns 小写单词数组
 */
function splitWords(input: string): string[] {
  return input
    .replace(/^Bz(?=[A-Z])/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .split('-')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * 将单词首字母大写
 * @param word 输入单词
 * @returns 首字母大写的单词
 */
function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

/**
 * 根据原始名称解析组件元数据
 * @param rawName 原始组件名称
 * @returns 组件元数据对象
 */
function resolveComponentMeta(rawName: string): ComponentMeta {
  const words = splitWords(rawName)

  if (words.length === 0) {
    throw new Error(`Invalid component name "${rawName}".`)
  }

  const pascalName = words.map(capitalize).join('')
  const componentName = `Bz${pascalName}`
  const kebabName = words.join('-')
  const cssName = `bz-${kebabName}`

  return {
    componentName,
    pascalName,
    kebabName,
    cssName,
  }
}

/**
 * 检查路径是否存在
 * @param targetPath 要检查的路径
 * @returns 如果路径存在则返回 true
 */
async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await stat(targetPath)
    return true
  } catch {
    return false
  }
}

/**
 * 构建 Props 类型定义文件模板
 * @param pascalName PascalCase 格式的组件名
 * @returns Props 文件内容
 */
function buildPropsTemplate(pascalName: string): string {
  return `export interface ${pascalName}Props {
  label?: string
}
`
}

/**
 * 构建 Vue 组件模板
 * @param meta 组件元数据
 * @returns Vue 组件文件内容
 */
function buildVueTemplate(meta: ComponentMeta): string {
  return `<template>
  <div class="${meta.cssName}">
    <slot>{{ label }}</slot>
  </div>
</template>

<script setup lang="ts">
import type { ${meta.pascalName}Props } from '../props'

withDefaults(defineProps<${meta.pascalName}Props>(), {
  label: ''
})
</script>
`
}

/**
 * 构建组件入口文件模板
 * @param meta 组件元数据
 * @returns 入口文件内容
 */
function buildIndexTemplate(meta: ComponentMeta): string {
  return `import ${meta.pascalName} from './src/${meta.kebabName}.vue'
import { withInstall } from '../../internal/with-install'

export const ${meta.componentName} = withInstall(${meta.pascalName}, '${meta.componentName}')

export default ${meta.componentName}
export * from './props'
`
}

/**
 * 构建样式文件模板
 * @param meta 组件元数据
 * @returns 样式文件内容
 */
function buildStyleTemplate(meta: ComponentMeta): string {
  return `.${meta.cssName} {
  display: inline-flex;
  align-items: center;
}
`
}

/**
 * 构建测试文件模板
 * @param meta 组件元数据
 * @returns 测试文件内容
 */
function buildTestTemplate(meta: ComponentMeta): string {
  return `import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { ${meta.componentName} } from '../packages/components'

describe('${meta.componentName}', () => {
  it('renders label text', () => {
    const wrapper = mount(${meta.componentName}, {
      props: {
        label: '${meta.pascalName}'
      }
    })

    expect(wrapper.text()).toContain('${meta.pascalName}')
  })

  it('installs component on app', () => {
    const app = {
      component: vi.fn()
    }

    ${meta.componentName}.install?.(app as never)

    expect(app.component).toHaveBeenCalledWith('${meta.componentName}', ${meta.componentName})
  })
})
`
}

/**
 * 主函数：创建组件脚手架
 */
async function main(): Promise<void> {
  const { rawName, dryRun } = parseArgs(process.argv.slice(2))
  const meta = resolveComponentMeta(rawName)
  const componentRoot = path.join(componentsDir, meta.kebabName)
  const srcDir = path.join(componentRoot, 'src')
  const styleDir = path.join(componentRoot, 'style')
  const testFilePath = path.join(testsDir, `${meta.kebabName}.spec.ts`)

  if (await pathExists(componentRoot)) {
    throw new Error(
      `Component already exists: packages/components/${meta.kebabName}`
    )
  }

  // 先创建源文件，然后让注册表脚本重新生成聚合文件
  const outputs: OutputFile[] = [
    {
      path: path.join(componentRoot, 'props.ts'),
      content: buildPropsTemplate(meta.pascalName),
    },
    {
      path: path.join(srcDir, `${meta.kebabName}.vue`),
      content: buildVueTemplate(meta),
    },
    {
      path: path.join(componentRoot, 'index.ts'),
      content: buildIndexTemplate(meta),
    },
    {
      path: path.join(styleDir, 'index.scss'),
      content: buildStyleTemplate(meta),
    },
    {
      path: testFilePath,
      content: buildTestTemplate(meta),
    },
  ]

  if (dryRun) {
    console.log(`# Dry Run`)
    console.log(`Component: ${meta.componentName}`)
    console.log(`Directory: packages/components/${meta.kebabName}`)
    console.log('')
    outputs.forEach((output) => {
      console.log(`Create: ${path.relative(repoRoot, output.path)}`)
    })
    await syncComponentRegistry({ dryRun: true })
    return
  }

  await mkdir(srcDir, { recursive: true })
  await mkdir(styleDir, { recursive: true })
  await mkdir(testsDir, { recursive: true })

  await Promise.all(
    outputs.map((output) => writeFile(output.path, output.content, 'utf8'))
  )

  // 从目录树重新生成共享导出、安装程序默认值和主题导入
  await syncComponentRegistry()

  console.log(`Created component scaffold: ${meta.componentName}`)
  console.log(`- packages/components/${meta.kebabName}/props.ts`)
  console.log(
    `- packages/components/${meta.kebabName}/src/${meta.kebabName}.vue`
  )
  console.log(`- tests/${meta.kebabName}.spec.ts`)
  console.log(`- packages/components/${meta.kebabName}/index.ts`)
  console.log(`- packages/components/${meta.kebabName}/style/index.scss`)
  console.log(`Updated: packages/components/index.ts`)
  console.log(`Updated: packages/ui/defaults.ts`)
  console.log(`Updated: packages/theme-chalk/src/index.scss`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
