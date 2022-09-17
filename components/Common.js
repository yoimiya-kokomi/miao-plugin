import Cfg from './Cfg.js'
import { Version } from './index.js'

import render from './common-lib/render.js'

export const todoV3 = function (e) {
  if (Version.isV3) {
    e.reply('本功能暂时不支持V3版Yunzai...')
    return true
  }
  return false
}

function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default {
  render,
  cfg: Cfg.get,
  isDisable: Cfg.isDisable,
  todoV3,
  sleep
}
