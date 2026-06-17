import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import { packageAliases } from '../../tooling/config/project-paths.mjs'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: [
        resolve(__dirname, 'index.ts'),
        resolve(__dirname, 'defaults.ts'),
        resolve(__dirname, 'make-installer.ts'),
        resolve(__dirname, '../components'),
        resolve(__dirname, '../utils'),
      ],
      exclude: [resolve(__dirname, 'vite.config.ts')],
      outDir: [resolve(__dirname, 'dist/types')],
      insertTypesEntry: true,
      tsconfigPath: resolve(__dirname, '../../tsconfig.build.json'),
    }),
  ],
  resolve: {
    alias: packageAliases,
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    lib: {
      entry: resolve(__dirname, 'index.ts'),
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
