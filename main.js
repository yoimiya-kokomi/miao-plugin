import { createApps } from 'alemonjs'
import { apps } from './index.js'
const app = createApps(import.meta.url)
app.setMessage(async e => {
  const data = await runtime.init(e)
  e = data.e
  e.sender = {}
  e.sender.card = e.user_name
  return e
})
app.component(apps)
app.mount()
