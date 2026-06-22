import BzshUI from '@bzsh-ui/core'
import { createApp } from 'vue'

import App from './App.vue'
import './styles/index.scss'
import 'element-plus/dist/index.css'

createApp(App).use(BzshUI).mount('#app')
