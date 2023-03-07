import Wife from './character/AvatarWife.js'
import { App } from '#miao'

let app = App.init({
  id: 'poke',
  name: '戳一戳',
  event: 'poke'
})

app.reg({
  pockWife: {
    fn: Wife.poke,
    describe: '#老公 #老婆 查询'
  }
})

export default app
