import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['packages'],
      outDir: ['dist/types'],
      insertTypesEntry: true,
      tsconfigPath: resolve(__dirname, 'tsconfig.build.json')
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'packages'),
      '@bzsh-ui/components': resolve(__dirname, 'packages/components/index.ts'),
      '@bzsh-ui/core': resolve(__dirname, 'packages/bzsh-ui/index.ts'),
      '@bzsh-ui/utils': resolve(__dirname, 'packages/utils/index.ts')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'packages/bzsh-ui/index.ts'),
      name: 'BzshUI',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs')
    },
    rollupOptions: {
      external: ['vue', 'element-plus'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        },
        assetFileNames: 'style/[name][extname]'
      }
    },
    sourcemap: true,
    emptyOutDir: true
  }
})
