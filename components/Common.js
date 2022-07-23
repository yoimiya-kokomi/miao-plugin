import { Cfg } from './index.js'
import { segment } from 'oicq'
import { currentVersion, yunzaiVersion, isV3 } from './Changelog.js'

export const render = async function (path, params, cfg) {
  let paths = path.split('/')
  let { render, e } = cfg
  let layoutPath = process.cwd() + '/plugins/miao-plugin/resources/common/layout/'
  let base64 = await render(paths[0], paths[1], {
    ...params,
    _layout_path: layoutPath,
    defaultLayout: layoutPath + 'default.html',
    elemLayout: layoutPath + 'elem.html',
    sys: {
      scale: Cfg.scale(cfg.scale || 1),
      copyright: `Created By Yunzai-Bot<span class="version">${yunzaiVersion}</span> & Miao-Plugin<span class="version">${currentVersion}</span>`
    }
  })

  if (base64) {
    return isV3 ? await e.reply(base64) : await e.reply(segment.image(`base64://${base64}`))
  }

  return true
}

export const todoV3 = function (e) {
  if (isV3) {
    e.reply('本功能暂时不支持V3版Yunzai...')
    return true
  }
  return false
}

export default {
  render,
  cfg: Cfg.get,
  isDisable: Cfg.isDisable,
  todoV3
}
