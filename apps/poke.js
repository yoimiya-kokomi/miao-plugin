import { App } from '../components/index.js'
import { pokeWife } from './character/avatar-wife.js'

let app = App.init({
  id: 'poke',
  name: '戳一戳',
  event: 'poke'
})

app.reg('pock-wife', pokeWife, {
  describe: '#老公 #老婆 查询'
})

export default app
