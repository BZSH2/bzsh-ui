import { mkdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { componentsDir, repoRoot } from '../tooling/config/project-paths.mjs'
import { syncComponentRegistry } from '../tooling/scripts/component-registry.mjs'

const testsDir = path.join(repoRoot, 'tests')

function printUsage() {
  console.log(`Usage:
  pnpm component <name> [--dry-run]

Examples:
  pnpm component input
  pnpm component Input
  pnpm component BzInput
  pnpm component date-picker --dry-run`)
}

function parseArgs(argv) {
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
    rawName: nameArg.trim()
  }
}

function splitWords(input) {
  return input
    .replace(/^Bz(?=[A-Z])/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .split('-')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function resolveComponentMeta(rawName) {
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
    cssName
  }
}

async function pathExists(targetPath) {
  try {
    await stat(targetPath)
    return true
  } catch {
    return false
  }
}

function buildPropsTemplate(pascalName) {
  return `export interface ${pascalName}Props {
  label?: string
}
`
}

function buildVueTemplate(meta) {
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

function buildIndexTemplate(meta) {
  return `import ${meta.pascalName} from './src/${meta.kebabName}.vue'
import { withInstall } from '../../internal/with-install'

export const ${meta.componentName} = withInstall(${meta.pascalName}, '${meta.componentName}')

export default ${meta.componentName}
export * from './props'
`
}

function buildStyleTemplate(meta) {
  return `.${meta.cssName} {
  display: inline-flex;
  align-items: center;
}
`
}

function buildTestTemplate(meta) {
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

async function main() {
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

  const outputs = [
    {
      path: path.join(componentRoot, 'props.ts'),
      content: buildPropsTemplate(meta.pascalName)
    },
    {
      path: path.join(srcDir, `${meta.kebabName}.vue`),
      content: buildVueTemplate(meta)
    },
    {
      path: path.join(componentRoot, 'index.ts'),
      content: buildIndexTemplate(meta)
    },
    {
      path: path.join(styleDir, 'index.scss'),
      content: buildStyleTemplate(meta)
    },
    {
      path: testFilePath,
      content: buildTestTemplate(meta)
    }
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
  console.log(`Updated: packages/bzsh-ui/defaults.ts`)
  console.log(`Updated: packages/theme-chalk/src/index.scss`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
