import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import { packageAliases } from '../../tooling/config/project-paths'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: packageAliases,
  },
})
