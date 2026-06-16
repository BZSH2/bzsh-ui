import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '../packages'),
      '@bzsh-ui/components': resolve(
        __dirname,
        '../packages/components/index.ts'
      ),
      '@bzsh-ui/core': resolve(__dirname, '../packages/bzsh-ui/index.ts'),
      '@bzsh-ui/utils': resolve(__dirname, '../packages/utils/index.ts')
    }
  }
})
