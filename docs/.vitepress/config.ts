import { readFileSync, readdirSync } from 'node:fs'
import { basename, posix } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

import type { DefaultTheme } from 'vitepress'

type DocSection = {
  dirName: string
  navText: string
  sidebarText: string
}

function sortDocFiles(left: string, right: string): number {
  if (left === 'index.md') return -1
  if (right === 'index.md') return 1
  return left.localeCompare(right)
}

function getHeading(filePath: string, fallback: string) {
  const content = readFileSync(filePath, 'utf8')
  return content.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? fallback
}

function toDocLink(dirName: string, relativePath: string) {
  const kebabName = relativePath.replace(/\.md$/, '')

  if (kebabName === 'index') return `/${dirName}/`
  if (kebabName.endsWith('/index')) {
    return `/${dirName}/${kebabName.slice(0, -'/index'.length)}/`
  }
  return `/${dirName}/${kebabName}`
}

function getSectionItems(dirName: string, nestedDir = ''): DefaultTheme.SidebarItem[] {
  const docsDir = fileURLToPath(new URL(`../${dirName}/${nestedDir}`, import.meta.url))
  const entries = readdirSync(docsDir, { withFileTypes: true }).sort((left, right) => {
    if (left.isDirectory() && !right.isDirectory()) return 1
    if (!left.isDirectory() && right.isDirectory()) return -1
    return sortDocFiles(left.name, right.name)
  })

  const items: DefaultTheme.SidebarItem[] = []

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      const relativePath = nestedDir ? posix.join(nestedDir, entry.name) : entry.name
      const filePath = fileURLToPath(new URL(`../${dirName}/${relativePath}`, import.meta.url))

      items.push({
        text: getHeading(filePath, basename(entry.name, '.md')),
        link: toDocLink(dirName, relativePath),
      })
    }

    if (entry.isDirectory()) {
      const relativeDir = nestedDir ? posix.join(nestedDir, entry.name) : entry.name
      const indexPath = fileURLToPath(
        new URL(`../${dirName}/${relativeDir}/index.md`, import.meta.url)
      )
      const groupText = getHeading(indexPath, entry.name)

      items.push({
        text: groupText,
        collapsed: false,
        items: getSectionItems(dirName, relativeDir),
      })
    }
  }

  return items
}

function getFirstLink(items: DefaultTheme.SidebarItem[]): string | undefined {
  for (const item of items) {
    if ('link' in item && item.link) return item.link
    if ('items' in item && item.items) {
      const nestedLink = getFirstLink(item.items)
      if (nestedLink) return nestedLink
    }
  }

  return undefined
}

const docSections: DocSection[] = [
  {
    dirName: 'components',
    navText: '组件',
    sidebarText: '组件',
  },
  {
    dirName: 'modules',
    navText: '模块',
    sidebarText: '组合模块',
  },
  {
    dirName: 'utils',
    navText: '工具',
    sidebarText: '工具函数',
  },
]

const sectionItemsMap = Object.fromEntries(
  docSections.map((section) => [section.dirName, getSectionItems(section.dirName)])
)

export default defineConfig({
  title: 'bzsh-ui',
  description: 'Vue 3 component library scaffold',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      ...docSections.map((section) => ({
        text: section.navText,
        link: getFirstLink(sectionItemsMap[section.dirName] ?? []) ?? '/guide/getting-started',
      })),
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          collapsed: false,
          items: [{ text: '快速开始', link: '/guide/getting-started' }],
        },
      ],
      ...Object.fromEntries(
        docSections.map((section) => [
          `/${section.dirName}/`,
          [
            {
              text: section.sidebarText,
              collapsed: false,
              items: sectionItemsMap[section.dirName],
            },
          ],
        ])
      ),
    },
  },
})
