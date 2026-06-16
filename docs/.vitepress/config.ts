import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'bzsh-ui',
  description: 'Vue 3 component library scaffold',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '组件', link: '/components/button' }
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
          items: [{ text: 'Button 按钮', link: '/components/button' }]
        }
      ]
    }
  }
})
