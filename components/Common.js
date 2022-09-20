import Cfg from './Cfg.js'
import { Version } from './index.js'

import render from './common-lib/render.js'

function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default {
  render,
  cfg: Cfg.get,
  isDisable: Cfg.isDisable,
  sleep
}
