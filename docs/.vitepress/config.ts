import { readFileSync, readdirSync } from 'node:fs'
import { basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

function getComponentItems() {
  const docsDir = fileURLToPath(new URL('../components', import.meta.url))

  return readdirSync(docsDir)
    .filter((fileName) => fileName.endsWith('.md'))
    .sort((left, right) => left.localeCompare(right))
    .map((fileName) => {
      const filePath = fileURLToPath(new URL(`../components/${fileName}`, import.meta.url))
      const content = readFileSync(filePath, 'utf8')
      const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim()
      const kebabName = basename(fileName, '.md')

      return {
        text: heading ?? kebabName,
        link: `/components/${kebabName}`
      }
    })
}

const componentItems = getComponentItems()

const componentEntryLink = componentItems[0]?.link ?? '/guide/getting-started'

export default defineConfig({
  title: 'bzsh-ui',
  description: 'Vue 3 component library scaffold',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '组件', link: componentEntryLink }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [{ text: '快速开始', link: '/guide/getting-started' }]
        }
      ],
      '/components/': [
        {
          text: '组件',
          items: componentItems
        }
      ]
    }
  }
})
