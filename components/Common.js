import Cfg from './Cfg.js'
import { Version } from './index.js'
import { segment } from 'oicq'

export const render = async function (path, params, cfg) {
  let paths = path.split('/')
  let { render, e } = cfg
  let layoutPath = process.cwd() + '/plugins/miao-plugin/resources/common/layout/'
  let base64 = await render(paths[0], paths[1], {
    ...params,
    _layout_path: layoutPath,
    _tpl_path: process.cwd() + '/plugins/miao-plugin/resources/common/tpl/',
    defaultLayout: layoutPath + 'default.html',
    elemLayout: layoutPath + 'elem.html',
    sys: {
      scale: Cfg.scale(cfg.scale || 1),
      copyright: `Created By Yunzai-Bot<span class="version">${Version.yunzai}</span> & Miao-Plugin<span class="version">${Version.version}</span>`
    }
  })

  let ret = true
  if (base64) {
    ret = Version.isV3 ? await e.reply(base64) : await e.reply(segment.image(`base64://${base64}`))
  }
  return cfg.retMsgId ? ret : true
}

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
