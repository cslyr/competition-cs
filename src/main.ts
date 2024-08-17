import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from '@/router'
import * as store from '@/store'
import * as echarts from 'echarts' // 直接引入echarts库
import '@/assets/css/index.scss'
import 'element-plus/dist/index.css'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.config.globalProperties.$echarts = echarts // 将echarts挂载到全局属性上
app.use(store).use(ElementPlus).use(router).mount('#app')
