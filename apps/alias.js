/**
 * 喵喵自定义角色别名命令
 *
 * #喵喵别名原神设置 角色名 别名
 * #喵喵别名(崩|星)铁设置 角色名 别名
 * #喵喵别名设置 角色名 别名
 * #喵喵别名原神删除 别名
 * #喵喵别名(崩|星)铁删除 别名
 * #喵喵别名删除 别名
 * #喵喵别名(帮助)
 * */
import { App, Meta } from '#miao'
import CustomAlias from '../models/alias/CustomAlias.js'

let app = App.init({
  id: 'alias',
  name: '喵喵别名',
  desc: '喵喵自定义角色别名'
})

app.reg({
  help: {
    rule: /^[#*]喵喵别名(帮助)?$/,
    fn: aliasHelp,
    desc: '【#别名】 喵喵别名帮助'
  },
  setGs: {
    rule: /^[#*]喵喵别名原神设置\s+\S+\s+\S+$/,
    fn: setGsAlias,
    desc: '【#别名】 #喵喵别名原神设置 角色名 别名'
  },
  setSr: {
    rule: /^[#*]喵喵别名(崩|星)铁设置\s+\S+\s+\S+$/,
    fn: setSrAlias,
    desc: '【#别名】 #喵喵别名星铁设置 角色名 别名'
  },
  set: {
    rule: /^[#*]喵喵别名设置\s+\S+\s+\S+$/,
    fn: setAlias,
    desc: '【#别名】 #喵喵别名设置 角色名 别名'
  },
  delGs: {
    rule: /^[#*]喵喵别名原神删除\s+\S+$/,
    fn: delGsAlias,
    desc: '【#别名】 #喵喵别名原神删除 别名'
  },
  delSr: {
    rule: /^[#*]喵喵别名(崩|星)铁删除\s+\S+$/,
    fn: delSrAlias,
    desc: '【#别名】 #喵喵别名星铁删除 别名'
  },
  del: {
    rule: /^[#*]喵喵别名删除\s+\S+$/,
    fn: delAlias,
    desc: '【#别名】 #喵喵别名删除 别名'
  }
})

export default app

const helpMsg = [
  '【喵喵自定义别名命令】',
  '#喵喵别名原神设置 角色名 别名 - 为原神角色添加自定义别名',
  '#喵喵别名星铁设置 角色名 别名 - 为崩铁/星铁角色添加自定义别名（崩铁/星铁均可）',
  '#喵喵别名设置 角色名 别名 - 自动判断游戏并设置别名',
  '#喵喵别名原神删除 别名 - 删除原神自定义别名',
  '#喵喵别名星铁删除 别名 - 删除崩铁/星铁自定义别名',
  '#喵喵别名删除 别名 - 自动判断游戏并删除别名',
  '',
  '○ 角色名可输入标准名或已有别名，写入时自动转换为标准角色名',
  '○ 自定义别名保存于 miao-plugin/config/alias_gs.cfg 与 alias_sr.cfg',
  '○ 配置文件修改后自动热更新，无需重启；预设别名不受影响'
].join('\n')

async function aliasHelp (e) {
  return e.reply(helpMsg)
}

// 解析「设置」类命令参数：[角色名, 别名]
function parseSetArgs (e, reg) {
  let msg = (e.original_msg || e.msg || '').trim()
  let ret = reg.exec(msg)
  if (!ret) return null
  let parts = ret[1].trim().split(/\s+/)
  if (parts.length !== 2) return null
  return { name: parts[0], alias: parts[1] }
}

// 解析「删除」类命令参数
function parseDelArgs (e, reg) {
  let msg = (e.original_msg || e.msg || '').trim()
  let ret = reg.exec(msg)
  if (!ret) return null
  let alias = ret[1].trim()
  return alias ? { alias } : null
}

async function setGsAlias (e) {
  await CustomAlias.init()
  let args = parseSetArgs(e, /^[#*]喵喵别名原神设置\s+(.+)$/)
  if (!args) {
    return e.reply('命令格式：#喵喵别名原神设置 角色名 别名')
  }
  let ret = await CustomAlias.setAlias('gs', args.name, args.alias)
  return e.reply(ret.msg)
}

async function setSrAlias (e) {
  await CustomAlias.init()
  let args = parseSetArgs(e, /^[#*]喵喵别名(崩|星)铁设置\s+(.+)$/)
  if (!args) {
    return e.reply('命令格式：#喵喵别名星铁设置 角色名 别名')
  }
  let ret = await CustomAlias.setAlias('sr', args.name, args.alias)
  return e.reply(ret.msg)
}

async function setAlias (e) {
  await CustomAlias.init()
  let args = parseSetArgs(e, /^[#*]喵喵别名设置\s+(.+)$/)
  if (!args) {
    return e.reply('命令格式：#喵喵别名设置 角色名 别名')
  }
  let { name, alias } = args
  // 判断角色名属于原神还是崩铁
  let gsId = Meta.getId('gs', 'char', name)
  let srId = Meta.getId('sr', 'char', name)
  if (gsId && srId) {
    return e.reply('检测到重复用户名，建议使用#喵喵别名原神/星铁设置 的命令精确设置别名')
  }
  let game = gsId ? 'gs' : (srId ? 'sr' : '')
  if (!game) {
    return e.reply('未找到该角色')
  }
  let ret = await CustomAlias.setAlias(game, name, alias)
  return e.reply(ret.msg)
}

async function delGsAlias (e) {
  await CustomAlias.init()
  let args = parseDelArgs(e, /^[#*]喵喵别名原神删除\s+(.+)$/)
  if (!args) {
    return e.reply('命令格式：#喵喵别名原神删除 别名')
  }
  let ret = await CustomAlias.delAlias('gs', args.alias)
  return e.reply(ret.msg)
}

async function delSrAlias (e) {
  await CustomAlias.init()
  let args = parseDelArgs(e, /^[#*]喵喵别名(崩|星)铁删除\s+(.+)$/)
  if (!args) {
    return e.reply('命令格式：#喵喵别名星铁删除 别名')
  }
  let ret = await CustomAlias.delAlias('sr', args.alias)
  return e.reply(ret.msg)
}

async function delAlias (e) {
  await CustomAlias.init()
  let args = parseDelArgs(e, /^[#*]喵喵别名删除\s+(.+)$/)
  if (!args) {
    return e.reply('命令格式：#喵喵别名删除 别名')
  }
  let { alias } = args
  // 同时检索两个自定义配置，判断别名归属
  let inGs = CustomAlias.findAlias('gs', alias)
  let inSr = CustomAlias.findAlias('sr', alias)
  if (inGs && inSr) {
    return e.reply('检测到该别名在原神与崩铁的自定义配置中均存在，请使用 #喵喵别名原神删除 或 #喵喵别名星铁删除 精确删除')
  }
  let game = inGs ? 'gs' : (inSr ? 'sr' : '')
  if (!game) {
    return e.reply('不存在该别名，或该别名为预设，不支持删除')
  }
  let ret = await CustomAlias.delAlias(game, alias)
  return e.reply(ret.msg)
}
