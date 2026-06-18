import type { App, Plugin } from 'vue'

/**
 * 为组件添加 install 方法的类型，使其成为 Vue 插件
 * @template T 原始组件的类型
 */
export type SFCWithInstall<T> = T & Plugin

/**
 * 为 Vue 组件添加 install 方法，使其可以通过 app.use() 安装
 * @template T 组件的类型
 * @param component Vue 单文件组件
 * @param name 组件的注册名称
 * @returns 带有 install 方法的组件
 */
export const withInstall = <T>(component: T, name: string) => {
  const target = component as SFCWithInstall<T>

  target.install = (app: App) => {
    app.component(name, target as never)
  }

  return target
}
