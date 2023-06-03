import Cfg from './Cfg.js'
import Render from './common/Render.js'

const Common = {
  render: Render.render,
  cfg: Cfg.get,
  sleep (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },

  async downFile () {
    console.log('down file')
  }

}

export default Common
