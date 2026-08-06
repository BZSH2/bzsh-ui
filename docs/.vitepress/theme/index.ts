import 'virtual:uno.css'
import DefaultTheme from 'vitepress/theme'

import 'element-plus/dist/index.css'

import DemoBlock from './components/DemoBlock.vue'
import BzUI from '../../../packages/ui/index'

import type { Theme } from 'vitepress'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(BzUI)
    app.component('DemoBlock', DemoBlock)
  },
}

export default theme
