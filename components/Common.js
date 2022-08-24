import Cfg from './Cfg.js'
import { Data, Version } from './index.js'
import { puppeteer } from '../adapter/index.js'

const plugin = 'miao-plugin'
const _path = process.cwd()

export const render = async function (path, params, cfg) {
  let [app, tpl] = path.split('/')
  let { e } = cfg
  let layoutPath = process.cwd() + '/plugins/miao-plugin/resources/common/layout/'
  let resPath = `../../../../../plugins/${plugin}/resources/`
  Data.createDir(_path + '/data/', `html/${plugin}/${app}/${tpl}`)
  let data = {
    ...params,
    _plugin: plugin,
    saveId: params.saveId || params.save_id || tpl,
    tplFile: `./plugins/${plugin}/resources/${app}/${tpl}.html`,
    pluResPath: resPath,
    _res_path: resPath,
    _layout_path: layoutPath,
    _tpl_path: process.cwd() + '/plugins/miao-plugin/resources/common/tpl/',
    defaultLayout: layoutPath + 'default.html',
    elemLayout: layoutPath + 'elem.html',
    sys: {
      scale: Cfg.scale(cfg.scale || 1),
      copyright: `Created By Yunzai-Bot<span class="version">${Version.yunzai}</span> & Miao-Plugin<span class="version">${Version.version}</span>`
    }
  }
  let base64 = await puppeteer.screenshot(`miao-plugin/${app}/${tpl}`, data)
  let ret = true
  if (base64) {
    ret = await e.reply(base64)
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
