import { readFileSync, readdirSync } from 'node:fs'
import { basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

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

function getSectionItems(dirName: string) {
  const docsDir = fileURLToPath(new URL(`../${dirName}`, import.meta.url))

  return readdirSync(docsDir)
    .filter((fileName) => fileName.endsWith('.md'))
    .sort(sortDocFiles)
    .map((fileName) => {
      const filePath = fileURLToPath(new URL(`../${dirName}/${fileName}`, import.meta.url))
      const content = readFileSync(filePath, 'utf8')
      const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim()
      const kebabName = basename(fileName, '.md')
      const link = kebabName === 'index' ? `/${dirName}/` : `/${dirName}/${kebabName}`

      return {
        text: heading ?? kebabName,
        link,
      }
    })
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
        link: sectionItemsMap[section.dirName]?.[0]?.link ?? '/guide/getting-started',
      })),
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [{ text: '快速开始', link: '/guide/getting-started' }],
        },
      ],
      ...Object.fromEntries(
        docSections.map((section) => [
          `/${section.dirName}/`,
          [
            {
              text: section.sidebarText,
              items: sectionItemsMap[section.dirName],
            },
          ],
        ])
      ),
    },
  },
})
