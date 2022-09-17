import { App } from '../components/index.js'
import { pokeWife } from './character/avatar-wife.js'

let app = App.init({
  id: 'poke',
  name: '角色查询',
  event: 'poke'
})

app.reg('pock-wife', pokeWife, {
  describe: '#老公 #老婆 查询'
})

export default app
