import { createApp, getAppName } from 'alemonjs'
const AppName = getAppName(import.meta.url)
const { apps } = await import('./apps/index.js').finally(() => {
  console.log('[APP] 喵喵插件 启动')
})
const app = createApp(AppName)
app.component(apps)
app.mount()