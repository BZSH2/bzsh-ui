import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import { packageAliases } from './tooling/config/project-paths.mjs'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['packages'],
      outDir: ['dist/types'],
      insertTypesEntry: true,
      tsconfigPath: resolve(__dirname, 'tsconfig.build.json'),
    }),
  ],
  resolve: {
    alias: packageAliases,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'packages/bzsh-ui/index.ts'),
      name: 'BzshUI',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['vue', 'element-plus'],
      output: {
        exports: 'named',
        globals: {
          'vue': 'Vue',
          'element-plus': 'ElementPlus',
        },
        assetFileNames: 'style/[name][extname]',
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
