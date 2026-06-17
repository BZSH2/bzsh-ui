import type { App, Plugin } from 'vue'

export const makeInstaller = (components: Plugin[] = []) => ({
  install(app: App) {
    components.forEach((component) => {
      app.use(component)
    })
  },
})
