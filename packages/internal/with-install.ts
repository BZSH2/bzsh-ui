import type { App, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

export const withInstall = <T>(component: T, name: string) => {
  const target = component as SFCWithInstall<T>

  target.install = (app: App) => {
    app.component(name, target as never)
  }

  return target
}
