import { Version } from '../index.js'
import Cfg from '../Cfg.js'

export default async function (path, params, cfg) {
  let { e } = cfg
  if (!e.runtime) {
    console.log('未找到e.runtime，请升级至最新版Yunzai')
  }
  return e.runtime.render('miao-plugin', path, params, {
    retType: cfg.retMsgId ? 'msgId' : 'default',
    beforeRender ({ data }) {
      let resPath = data.pluResPath
      const layoutPath = process.cwd() + '/plugins/miao-plugin/resources/common/layout/'
      return {
        ...data,
        _res_path: resPath,
        _layout_path: layoutPath,
        _tpl_path: process.cwd() + '/plugins/miao-plugin/resources/common/tpl/',
        defaultLayout: layoutPath + 'default.html',
        elemLayout: layoutPath + 'elem.html',
        sys: {
          scale: Cfg.scale(cfg.scale || 1),
          copyright: `Created By Yunzai-Bot<span class="version">${Version.yunzai}</span> & Miao-Plugin<span class="version">${Version.version}</span>`
        },
        pageGotoParams: {
          waitUntil: 'networkidle2'
        }
      }
    }
  })
}
