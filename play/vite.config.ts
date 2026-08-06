import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

import { packageAliases } from '../tooling/config/project-paths'

export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: packageAliases,
  },
})
