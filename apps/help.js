import lodash from 'lodash'
import fs from 'fs'
import { Cfg, Version, Common, Data, App } from '../components/index.js'
import customStyle from './help/style.js'

let app = App.init({
  id: 'help',
  name: '喵喵帮助',
  desc: '喵喵帮助'
})

app.reg('help', help, {
  rule: /^#?(喵喵)?(命令|帮助|菜单|help|说明|功能|指令|使用说明)$/,
  desc: '【#帮助】 #喵喵帮助'
})

app.reg('version', versionInfo, {
  rule: /^#?喵喵版本$/,
  desc: '【#帮助】 喵喵版本介绍'
})

export default app

const _path = process.cwd()
const helpPath = `${_path}/plugins/miao-plugin/resources/help`

async function help (e) {
  if (!/喵喵/.test(e.msg) && !Cfg.get('sys.help', false)) {
    return false
  }

  let custom = {}
  let help = {}
  if (fs.existsSync(`${helpPath}/help-cfg.js`)) {
    console.log('miao-plugin: 检测到存在help-cfg.js配置\n建议将help-cfg.js移为config/help.js或重新复制config/help_default.js进行配置~')
    help = await import(`file://${helpPath}/help-cfg.js?version=${new Date().getTime()}`)
  } else if (fs.existsSync(`${helpPath}/help-list.js`)) {
    console.log('miao-plugin: 检测到存在help-list.js配置，建议将help-list.js移为config/help.js或重新复制config/help_default.js进行配置~')
    help = await import(`file://${helpPath}/help-list.js?version=${new Date().getTime()}`)
  }

  let { diyCfg, sysCfg } = await Data.importCfg('help')

  // 兼容一下旧字段
  if (lodash.isArray(help.helpCfg)) {
    custom = {
      helpList: help.helpCfg,
      helpCfg: {}
    }
  } else {
    custom = help
  }

  let helpConfig = lodash.defaults(diyCfg.helpCfg || {}, custom.helpCfg, sysCfg.helpCfg)
  let helpList = diyCfg.helpList || custom.helpList || sysCfg.helpList

  let helpGroup = []

  lodash.forEach(helpList, (group) => {
    if (group.auth && group.auth === 'master' && !e.isMaster) {
      return
    }

    lodash.forEach(group.list, (help) => {
      let icon = help.icon * 1
      if (!icon) {
        help.css = 'display:none'
      } else {
        let x = (icon - 1) % 10
        let y = (icon - x - 1) / 10
        help.css = `background-position:-${x * 50}px -${y * 50}px`
      }
    })

    helpGroup.push(group)
  })

  let style = customStyle(diyCfg.helpCfg?.style || {}, sysCfg.helpCfg?.style || {})

  return await Common.render('help/index', {
    helpCfg: helpConfig,
    helpGroup,
    style,
    element: 'default'
  }, { e, scale: 1.2 })
}

async function versionInfo (e) {
  return await Common.render('help/version-info', {
    currentVersion: Version.version,
    changelogs: Version.changelogs,
    elem: 'cryo'
  }, { e, scale: 1.2 })
}
