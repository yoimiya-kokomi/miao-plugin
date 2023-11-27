import { createApps } from 'alemonjs'
import { apps } from './index.js'
const app = createApps(import.meta.url)
const arg = /^#?(\*|星铁|星轨|穹轨|星穹|崩铁|星穹铁道|崩坏星穹铁道|铁道)+/
app.setMessage(async e => {
  e.isSr = true
  e.isGs = true
  await runtime.init(e)
  Object.defineProperty(e, 'isSr', {
    get: () => e.game === 'sr',
    set: (v) => { e.game = v ? 'sr' : 'gs' }
  })
  Object.defineProperty(e, 'isGs', {
    get: () => e.game === 'gs',
    set: (v) => { e.game = v ? 'gs' : 'sr' }
  })
  if (arg.test(e.msg)) {
    e.game = 'sr'
    e.msg = e.msg.replace(arg, '#星铁')
  }
  e.sender = {}
  e.sender.card = e.user_name
  return e
})
app.setCharacter('#')
app.component(apps)
app.mount()
