/**
 * 自定义角色别名（#miao）
 *
 * 通过命令或手工编辑以下文件维护自定义别名：
 *   config/alias_gs.cfg  原神自定义别名
 *   config/alias_sr.cfg  崩铁/星铁自定义别名
 *
 * 文件格式（每行一个角色，兼容中英文冒号与逗号）：
 *   原神旅行者：黄毛，爷，降临者
 *
 * 特性：
 *  - 启动时与预设别名（resources 目录下 meta-gs / meta-sr 的 character/alias.js）合并写入内存别名缓存
 *  - fs.watchFile 监听文件变化，0.5s 防抖后自动刷新缓存（热更新）
 *  - 文件损坏/读取失败时跳过该文件，不影响预设别名功能，下次变更时重试
 *  - 写入采用「临时文件 + rename」原子写，并以 Promise 链加锁避免并发冲突
 * */
import fs from 'node:fs'
import lodash from 'lodash'
import { Meta } from '#miao'
import { miaoPath } from '#miao.path'

// 热更新防抖时间（ms）
const RELOAD_DEBOUNCE = 500
// watchFile 轮询间隔（ms）
const WATCH_INTERVAL = 1000

const state = {
  gs: {
    path: `${miaoPath}/config/alias_gs.cfg`,
    applied: {}, // 已注入内存别名的记录: aliasKey -> 被覆盖前的预设值(undefined 表示原本不存在)
    timer: null,
    watching: false
  },
  sr: {
    path: `${miaoPath}/config/alias_sr.cfg`,
    applied: {},
    timer: null,
    watching: false
  }
}

const log = {
  mark (msg) {
    (typeof logger !== 'undefined' ? logger.mark : console.log)(`[miao别名] ${msg}`)
  },
  error (msg, e) {
    let fn = typeof logger !== 'undefined' ? logger.error : console.error
    fn(`[miao别名] ${msg}`, e || '')
  }
}

/**
 * 解析单行配置：标准角色名：别名1，别名2
 * 兼容中英文冒号、中英文逗号，解析失败返回 null
 * */
function parseLine (line) {
  if (!line) return null
  let ret = /^([^：:]+)[：:](.*)$/.exec(line.trim())
  if (!ret) return null
  let name = lodash.trim(ret[1])
  let aliases = ret[2].split(/[,，]/).map((t) => lodash.trim(t)).filter((t) => !!t)
  if (!name || aliases.length === 0) return null
  return { name, aliases }
}

/**
 * 读取自定义别名文件，返回 { ok, entries }
 * 文件不存在或读取/解析异常时返回 { ok: false, entries: [] }，由调用方跳过
 * */
function readCfg (game) {
  let st = state[game]
  try {
    if (!fs.existsSync(st.path)) {
      return { ok: true, entries: [] }
    }
    let content = fs.readFileSync(st.path, 'utf-8')
    let entries = []
    lodash.forEach(content.split(/\r?\n/), (line) => {
      // 逐行容错：坏行跳过，不影响其他行
      try {
        let entry = parseLine(line)
        if (entry) entries.push(entry)
      } catch (e) {
        log.error(`解析 ${game} 别名配置单行失败，已跳过`, e)
      }
    })
    return { ok: true, entries }
  } catch (e) {
    log.error(`读取 ${game} 自定义别名文件失败，已跳过`, e)
    return { ok: false, entries: [] }
  }
}

/**
 * 将自定义别名合并进内存别名缓存（MetaStore）
 * 重新应用前会先移除上一次注入的别名，并恢复可能被覆盖的预设别名
 * */
function applyToMeta (game) {
  let st = state[game]
  let meta = Meta.create(game, 'char')
  // 1. 回滚上次注入的自定义别名
  lodash.forEach(st.applied, (prev, key) => {
    if (prev === undefined) {
      delete meta.alias[key]
    } else {
      // 恢复被覆盖的预设别名
      meta.alias[key] = prev
    }
  })
  st.applied = {}
  // 2. 重新读取并注入
  let { ok, entries } = readCfg(game)
  if (!ok) {
    // 文件异常时跳过，保留预设别名，等待下次文件变更重试
    return false
  }
  lodash.forEach(entries, ({ name, aliases }) => {
    // 标准角色名（或已有别名）解析为角色ID，解析失败则跳过该行
    let id = meta.getId(name)
    if (!id) return
    lodash.forEach(aliases, (alias) => {
      let key = lodash.trim(alias + '').toLowerCase()
      if (!key) return
      // 记录覆盖前的预设值，便于回滚
      if (!(key in st.applied)) {
        st.applied[key] = (key in meta.alias) ? meta.alias[key] : undefined
      }
      meta.alias[key] = id
    })
  })
  return true
}

/**
 * 监听自定义别名文件，变化后延迟 0.5s 刷新缓存（防抖，避免文件抖动）
 * 使用 fs.watchFile，文件不存在时创建也会触发
 * */
function watch (game) {
  let st = state[game]
  if (st.watching) return
  st.watching = true
  try {
    fs.watchFile(st.path, { interval: WATCH_INTERVAL }, () => {
      if (st.timer) clearTimeout(st.timer)
      st.timer = setTimeout(() => {
        st.timer = null
        try {
          if (applyToMeta(game)) {
            log.mark(`${game} 自定义别名配置已热更新`)
          }
        } catch (e) {
          log.error(`${game} 别名热更新失败，已跳过`, e)
        }
      }, RELOAD_DEBOUNCE)
    })
  } catch (e) {
    st.watching = false
    log.error(`监听 ${game} 别名文件失败`, e)
  }
}

// 写入锁：Promise 链，串行化所有配置写入，避免并发冲突
let writeChain = Promise.resolve()

/**
 * 原子写入：先写临时文件，再 rename 替换
 * */
function atomicWrite (path, content) {
  let task = writeChain.then(async () => {
    let tmp = `${path}.tmp`
    await fs.promises.writeFile(tmp, content, 'utf-8')
    await fs.promises.rename(tmp, path)
  })
  // 链上吞掉异常避免锁死，异常仍抛给当次调用方
  writeChain = task.catch(() => {})
  return task
}

/**
 * 在自定义配置中定位包含指定别名的条目（大小写不敏感）
 * 返回 { index, name, aliases } 或 null
 * */
function findAlias (game, alias) {
  let key = lodash.trim(alias + '').toLowerCase()
  if (!key) return null
  let { entries } = readCfg(game)
  for (let index = 0; index < entries.length; index++) {
    let entry = entries[index]
    if (entry.aliases.some((a) => a.toLowerCase() === key)) {
      return { index, name: entry.name, aliases: entry.aliases }
    }
  }
  return null
}

/**
 * 设置别名：将「角色名 别名」写入自定义配置并立即刷新缓存
 * 角色名支持标准名或已有别名（预设/自定义均可），写入时统一转换为标准角色名
 * */
async function setAlias (game, charName, alias) {
  let st = state[game]
  let meta = Meta.create(game, 'char')
  alias = lodash.trim(alias + '')
  charName = lodash.trim(charName + '')

  // 别名合法性校验：不允许包含分隔符或纯数字（避免与角色ID混淆）
  if (!alias || /[,，:：\s]/.test(alias)) {
    return { ok: false, msg: '别名不能为空，且不能包含逗号、冒号或空格' }
  }
  if (/^\d+$/.test(alias)) {
    return { ok: false, msg: '别名不能为纯数字，避免与角色ID冲突' }
  }

  // 解析标准角色名
  let id = meta.getId(charName)
  if (!id) {
    return { ok: false, msg: '未找到该角色' }
  }
  let stdName = meta.data[id]?.name || charName

  // 冲突检查：别名已被其他角色占用（预设或自定义）
  let existId = meta.getId(alias)
  if (existId) {
    let existName = meta.data[existId]?.name || alias
    if (existId === id) {
      return { ok: false, msg: `「${stdName}」已拥有别名「${alias}」，无需重复添加` }
    }
    return { ok: false, msg: `别名「${alias}」已被角色「${existName}」使用，请更换别名` }
  }

  // 读取现有配置行，定位该角色的映射行
  let { ok, entries } = readCfg(game)
  if (!ok) {
    return { ok: false, msg: `自定义别名文件 ${st.path} 读取失败，请检查文件后重试` }
  }
  let target = null
  for (let entry of entries) {
    let entryId = meta.getId(entry.name)
    if (entryId === id) {
      target = entry
      break
    }
  }

  let lines = []
  if (fs.existsSync(st.path)) {
    lines = fs.readFileSync(st.path, 'utf-8').split(/\r?\n/)
  }
  // 重建该角色的映射行，标准角色名开头，保证不出现「别名1：别名2」
  if (target) {
    let newLine = `${stdName}：${[...target.aliases, alias].join('，')}`
    let replaced = false
    // 替换第一条能解析出同名角色的行，其余行原样保留
    for (let i = 0; i < lines.length; i++) {
      let entry = parseLine(lines[i])
      if (entry && meta.getId(entry.name) === id) {
        lines[i] = replaced ? lines[i] : newLine
        replaced = true
      }
    }
    if (!replaced) lines.push(newLine)
  } else {
    lines.push(`${stdName}：${alias}`)
  }
  // 清理尾部空行，保证以换行结尾
  while (lines.length > 0 && lodash.trim(lines[lines.length - 1]) === '') lines.pop()
  let content = `${lines.join('\n')}\n`

  await atomicWrite(st.path, content)
  // 立即刷新缓存，无需等待热更新
  applyToMeta(game)
  return { ok: true, msg: `${stdName}：${alias} 添加成功。` }
}

/**
 * 删除别名：仅检索自定义配置文件，不涉及预设别名
 * 删除后若该行无剩余别名，则整行删除
 * */
async function delAlias (game, alias) {
  let st = state[game]
  alias = lodash.trim(alias + '')
  if (!alias) {
    return { ok: false, msg: '请输入要删除的别名' }
  }

  let found = findAlias(game, alias)
  if (!found) {
    return { ok: false, msg: '不存在该别名，或该别名为预设，不支持删除' }
  }

  // 从对应行移除该别名（大小写不敏感）
  let rest = found.aliases.filter((a) => a.toLowerCase() !== alias.toLowerCase())
  let lines = fs.readFileSync(st.path, 'utf-8').split(/\r?\n/)
  let removed = false
  for (let i = 0; i < lines.length; i++) {
    let entry = parseLine(lines[i])
    if (!entry) continue
    let entryId = lodash.trim(entry.name).toLowerCase()
    if (entryId === lodash.trim(found.name).toLowerCase() && entry.aliases.some((a) => a.toLowerCase() === alias.toLowerCase())) {
      if (rest.length === 0) {
        // 无剩余别名，删除整行
        lines.splice(i, 1)
      } else {
        lines[i] = `${found.name}：${rest.join('，')}`
      }
      removed = true
      break
    }
  }
  if (!removed) {
    return { ok: false, msg: '不存在该别名，或该别名为预设，不支持删除' }
  }
  while (lines.length > 0 && lodash.trim(lines[lines.length - 1]) === '') lines.pop()
  let content = lines.length === 0 ? '' : `${lines.join('\n')}\n`
  await atomicWrite(st.path, content)
  // 立即刷新缓存，删除立即生效
  applyToMeta(game)
  return { ok: true, msg: `别名「${alias}」删除成功` }
}

/**
 * 初始化：合并自定义别名进缓存并启动文件监听
 * 幂等，可安全重复调用
 * */
let initPromise = null
async function doInit () {
  // 等待 Meta 角色数据就绪（最多重试 12 次 × 5s）
  for (let i = 0; i < 12; i++) {
    let meta = Meta.create('gs', 'char')
    if (meta.getIds().length > 0) break
    await new Promise((resolve) => setTimeout(resolve, 5000))
  }
  for (let game of ['gs', 'sr']) {
    try {
      applyToMeta(game)
    } catch (e) {
      log.error(`初始化 ${game} 自定义别名失败，已跳过`, e)
    }
    watch(game)
  }
}

const CustomAlias = {
  init () {
    if (!initPromise) {
      initPromise = doInit()
    }
    return initPromise
  },
  setAlias,
  delAlias,
  findAlias,
  parseLine,
  applyToMeta
}

export default CustomAlias
