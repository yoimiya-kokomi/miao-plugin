/**
 * 喵喵自定义角色别名命令
 *
 * #喵喵别名原神设置 角色名 别名
 * #喵喵别名[崩星]铁设置 角色名 别名
 * #喵喵别名设置 角色名 别名
 * #喵喵别名原神删除 别名
 * #喵喵别名[崩星]铁删除 别名
 * #喵喵别名删除 别名
 * #喵喵别名列表
 * #喵喵别名原神列表
 * #喵喵别名[崩星]铁列表
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
    rule: /^[#*](?:星铁)?喵喵别名(帮助)?$/,
    fn: aliasHelp,
    desc: '【#别名】 喵喵别名帮助'
  },
  setGs: {
    rule: /^[#*](?:星铁)?喵喵别名原神设置\s+\S+\s+\S+$/,
    fn: setGsAlias,
    desc: '【#别名】 #喵喵别名原神设置 角色名 别名'
  },
  setSr: {
    rule: /^[#*](?:星铁)?喵喵别名[崩星]铁设置\s+\S+\s+\S+$/,
    fn: setSrAlias,
    desc: '【#别名】 #喵喵别名星铁设置 角色名 别名'
  },
  set: {
    rule: /^[#*](?:星铁)?喵喵别名设置\s+\S+\s+\S+$/,
    fn: setAlias,
    desc: '【#别名】 #喵喵别名设置 角色名 别名'
  },
  delGs: {
    rule: /^[#*](?:星铁)?喵喵别名原神删除\s+\S+$/,
    fn: delGsAlias,
    desc: '【#别名】 #喵喵别名原神删除 别名'
  },
  delSr: {
    rule: /^[#*](?:星铁)?喵喵别名[崩星]铁删除\s+\S+$/,
    fn: delSrAlias,
    desc: '【#别名】 #喵喵别名星铁删除 别名'
  },
  del: {
    rule: /^[#*](?:星铁)?喵喵别名删除\s+\S+$/,
    fn: delAlias,
    desc: '【#别名】 #喵喵别名删除 别名'
  },
  list: {
    rule: /^[#*](?:星铁)?喵喵别名列表$/,
    fn: listAlias,
    desc: '【#别名】 #喵喵别名列表 查看全部自定义别名'
  },
  listGs: {
    rule: /^[#*](?:星铁)?喵喵别名原神列表$/,
    fn: listGsAlias,
    desc: '【#别名】 #喵喵别名原神列表 查看原神自定义别名'
  },
  listSr: {
    rule: /^[#*](?:星铁)?喵喵别名[崩星]铁列表$/,
    fn: listSrAlias,
    desc: '【#别名】 #喵喵别名星铁列表 查看星铁自定义别名'
  }
})

export default app

const helpMsg = [
  '【喵喵自定义别名命令】',
  '✅#喵喵别名原神设置 角色名 别名 - 原神角色添加别名',
  '✅#喵喵别名星铁设置 角色名 别名 - 星铁角色添加别名',
  '✅#喵喵别名设置 角色名 别名 - 自动判断游戏并设置别名',
  '✅#喵喵别名原神删除 别名 - 删除原神自定义别名',
  '✅#喵喵别名星铁删除 别名 - 删除星铁自定义别名',
  '✅#喵喵别名删除 别名 - 自动判断游戏并删除别名',
  '✅#喵喵别名列表 - 查看原神与星铁全部自定义别名',
  '✅#喵喵别名原神列表 - 查看原神自定义别名',
  '✅#喵喵别名星铁列表 - 查看星铁自定义别名',
  '',
  'ℹ️ 角色名可输入标准名或已有别名，写入时自动转换为标准角色名',
  'ℹ️ 自定义别名保存于 miao-plugin/config/alias_gs.cfg 与 alias_sr.cfg',
  'ℹ️ 可直接手动修改alias_gs.cfg 与 alias_sr.cfg文件',
  'ℹ️ 配置文件修改后自动热更新，无需重启；预设别名不受影响'
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
  let args = parseSetArgs(e, /^[#*](?:星铁)?喵喵别名原神设置\s+(.+)$/)
  if (!args) {
    return e.reply('命令格式：#喵喵别名原神设置 角色名 别名')
  }
  let ret = await CustomAlias.setAlias('gs', args.name, args.alias)
  return e.reply(ret.msg)
}

async function setSrAlias (e) {
  await CustomAlias.init()
  let args = parseSetArgs(e, /^[#*](?:星铁)?喵喵别名[崩星]铁设置\s+(.+)$/)
  if (!args) {
    return e.reply('命令格式：#喵喵别名星铁设置 角色名 别名')
  }
  let ret = await CustomAlias.setAlias('sr', args.name, args.alias)
  return e.reply(ret.msg)
}

async function setAlias (e) {
  await CustomAlias.init()
  let args = parseSetArgs(e, /^[#*](?:星铁)?喵喵别名设置\s+(.+)$/)
  if (!args) {
    return e.reply('命令格式：#喵喵别名设置 角色名 别名')
  }
  let { name, alias } = args
  // 判断角色名属于原神还是星铁
  let gsId = Meta.getId('gs', 'char', name)
  let srId = Meta.getId('sr', 'char', name)
  if (gsId && srId) {
    return e.reply('检测到该角色名在原神与星铁的别名配置中均存在，建议使用#喵喵别名原神/星铁设置 的命令精确设置别名')
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
  let args = parseDelArgs(e, /^[#*](?:星铁)?喵喵别名原神删除\s+(.+)$/)
  if (!args) {
    return e.reply('命令格式：#喵喵别名原神删除 别名')
  }
  let ret = await CustomAlias.delAlias('gs', args.alias)
  return e.reply(ret.msg)
}

async function delSrAlias (e) {
  await CustomAlias.init()
  let args = parseDelArgs(e, /^[#*](?:星铁)?喵喵别名[崩星]铁删除\s+(.+)$/)
  if (!args) {
    return e.reply('命令格式：#喵喵别名星铁删除 别名')
  }
  let ret = await CustomAlias.delAlias('sr', args.alias)
  return e.reply(ret.msg)
}

async function delAlias (e) {
  await CustomAlias.init()
  let args = parseDelArgs(e, /^[#*](?:星铁)?喵喵别名删除\s+(.+)$/)
  if (!args) {
    return e.reply('命令格式：#喵喵别名删除 别名')
  }
  let { alias } = args
  // 同时检索两个自定义配置，判断别名归属
  let inGs = CustomAlias.findAlias('gs', alias)
  let inSr = CustomAlias.findAlias('sr', alias)
  if (inGs && inSr) {
    return e.reply('检测到该别名在原神与星铁的自定义配置中均存在，请使用 #喵喵别名原神删除 或 #喵喵别名星铁删除 精确删除')
  }
  let game = inGs ? 'gs' : (inSr ? 'sr' : '')
  if (!game) {
    return e.reply('不存在该别名，或该别名为预设，不支持删除')
  }
  let ret = await CustomAlias.delAlias(game, alias)
  return e.reply(ret.msg)
}

// ---- 列表命令 ----

const gameName = { gs: '原神', sr: '星铁' }

// 格式化某个游戏的自定义别名列表消息
function formatList (game) {
  let { exists, lines } = CustomAlias.getList(game)
  if (!exists) {
    return `暂无${gameName[game]}自定义别名（配置文件不存在，使用设置命令添加别名后将自动创建）`
  }
  if (lines.length === 0) {
    return `暂无${gameName[game]}自定义别名`
  }
  return [`【${gameName[game]}自定义别名】`, ...lines].join('\n')
}

async function listAlias (e) {
  // 分两次分别回复原神与星铁的自定义别名
  await e.reply(formatList('gs'))
  return e.reply(formatList('sr'))
}

async function listGsAlias (e) {
  return e.reply(formatList('gs'))
}

async function listSrAlias (e) {
  return e.reply(formatList('sr'))
}
