/**
 * 卡池信息查询
 *
 * 复用项目已有的卡池数据（poolDetail / mixPoolDetail / poolDetailSr）
 * 及角色、武器资源查找机制，不重复维护数据
 *
 * 命令格式：#(星铁)?${version}(${half})?卡池
 *   例：#6.7卡池  #6.7上半卡池  #星铁3.0卡池  #星铁4.1下半卡池
 * */
import lodash from 'lodash'
import { Character, Weapon } from '#miao.models'
import { poolDetail, mixPoolDetail } from '../../resources/meta-gs/info/index.js'
import { poolDetailSr } from '../../resources/meta-sr/info/index.js'

// 每行最多展示的图标数量，超出自动换行
const maxRowNum = 8

// 卡池展示分组，顺序固定：五星角色 / 四星角色 / 五星武器 / 四星武器
const poolGroups = [
  { key: 'char5', type: 'char', star: 5, title: '五星角色' },
  { key: 'char4', type: 'char', star: 4, title: '四星角色' },
  { key: 'weapon5', type: 'weapon', star: 5, title: '五星武器' },
  { key: 'weapon4', type: 'weapon', star: 4, title: '四星武器' }
]

const GachaPool = {
  /**
   * 解析卡池查询命令
   * @param msg 原始消息，如 `#6.7上半卡池`
   * @returns {game, version, half} 解析失败返回 false
   */
  parse (msg = '') {
    let ret = /^#(星铁)?((?:\d+\.)+\d+)(上半|下半)?卡池$/.exec(lodash.trim(msg || ''))
    if (!ret) {
      return false
    }
    return {
      game: ret[1] ? 'sr' : 'gs',
      version: ret[2],
      half: ret[3] || ''
    }
  },

  /**
   * 从指定卡池数据中筛选符合条件的记录，并标记数据来源
   * @param list 卡池数据源
   * @param version 版本号
   * @param half 上下半，为空则不限
   * @param type 来源标记，如 poolDetail / mixPoolDetail / poolDetailSr
   */
  filterPools (list, version, half, type) {
    return lodash.filter(list, (ds) => {
      if (ds.version !== version) {
        return false
      }
      // 未指定上下半时，返回该版本全部记录
      return !half || ds.half === half
    }).map((ds) => ({ ...ds, type }))
  },

  /**
   * 查询卡池记录
   * 原神查 poolDetail + mixPoolDetail，星铁只查 poolDetailSr
   */
  getPools (game, version, half = '') {
    if (game === 'sr') {
      return this.filterPools(poolDetailSr, version, half, 'poolDetailSr')
    }
    return [
      ...this.filterPools(poolDetail, version, half, 'poolDetail'),
      ...this.filterPools(mixPoolDetail, version, half, 'mixPoolDetail')
    ]
  },

  /**
   * 获取单个角色 / 武器的展示数据
   * 复用 Character / Weapon 的资源查找，未匹配到时返回 false
   */
  getItem (name, type, game) {
    if (type === 'char') {
      let char = Character.get(name, game)
      if (char) {
        return char.getData('star,name,abbr,img:face')
      }
    } else {
      let weapon = Weapon.get(name, game)
      if (weapon) {
        return weapon.getData('star,name,abbr,img')
      }
    }
    return false
  },

  /**
   * 将名称列表按每行最多 maxRowNum 个拆分为二维数组
   * 无法获取到资源的项直接跳过，避免渲染出空图标
   */
  chunkRows (names, type, game) {
    let rows = []
    let row = []
    lodash.forEach(names, (name) => {
      let item = this.getItem(name, type, game)
      if (!item) {
        return
      }
      row.push(item)
      if (row.length >= maxRowNum) {
        rows.push(row)
        row = []
      }
    })
    if (row.length > 0) {
      rows.push(row)
    }
    return rows
  },

  /**
   * 将单条卡池记录转换为绘图数据
   * isMix 用于模板标记 mix 来源
   */
  formatPool (pool, game) {
    let groups = []
    lodash.forEach(poolGroups, (g) => {
      let names = pool[g.key] || []
      // 空数组直接跳过该类别
      if (!names.length) {
        return
      }
      let rows = this.chunkRows(names, g.type, game)
      if (!rows.length) {
        return
      }
      groups.push({
        title: g.title,
        star: g.star,
        rows
      })
    })
    return {
      version: pool.version,
      half: pool.half || '',
      from: pool.from || '',
      to: pool.to || '',
      // 仅原神集录池（mixPoolDetail）需要标记
      isMix: pool.type === 'mixPoolDetail',
      groups
    }
  },

  /**
   * 查询并格式化卡池绘图数据
   */
  getData (game, version, half = '') {
    return lodash.map(this.getPools(game, version, half), (pool) => this.formatPool(pool, game))
  },

  /**
   * 按名称检索卡池（卡池信息穿透查询）
   * @param item 角色名或武器名（支持别名，自动转换为标准名）
   * @param simple 是否精简模式（只保留包含 item 的那一行）
   * @param isSrPrefix 命令是否以 #星铁 开头（决定检索优先级）
   * @returns { game, pools } 或 false
   */
  searchByItem (item, simple = false, isSrPrefix = false) {
    let games = isSrPrefix ? ['sr', 'gs'] : ['gs', 'sr']
    for (let game of games) {
      let resolved = this.resolveItem(item, game)
      if (!resolved) {
        continue
      }
      let pools = this.findPools(resolved.game, resolved, simple)
      if (pools.length) {
        return { game: resolved.game, pools }
      }
    }
    return false
  },

  /**
   * 将输入（标准名或别名）解析为标准角色名/武器名
   * 优先按角色解析，再按武器解析；返回 { type, name, game }
   */
  resolveItem (item, game) {
    let char = Character.get(item, game)
    if (char) {
      return { type: 'char', name: char.name, game: char.game || game }
    }
    let weapon = Weapon.get(item, game)
    if (weapon) {
      return { type: 'weapon', name: weapon.name, game: weapon.game || game }
    }
    return false
  },

  /**
   * 获取指定游戏的全部卡池数据（带 type 标记）
   * 原神：poolDetail + mixPoolDetail；星铁：poolDetailSr
   */
  getAllPools (game) {
    if (game === 'sr') {
      return lodash.map(poolDetailSr, (ds) => ({ ...ds, type: 'poolDetailSr' }))
    }
    return lodash.map(poolDetail, (ds) => ({ ...ds, type: 'poolDetail' }))
      .concat(lodash.map(mixPoolDetail, (ds) => ({ ...ds, type: 'mixPoolDetail' })))
  },

  /**
   * 在指定游戏的卡池数据中查找包含 item 的记录
   * simple 模式下每条记录仅保留包含 item 的那一行
   */
  findPools (game, resolved, simple) {
    let { type, name } = resolved
    let keys = type === 'char' ? ['char5', 'char4'] : ['weapon5', 'weapon4']
    let all = this.getAllPools(game)
    let matched = lodash.filter(all, (pool) => lodash.some(keys, (k) => (pool[k] || []).includes(name)))
    if (!matched.length) {
      return []
    }
    return lodash.map(matched, (pool) => {
      return simple ? this.formatSimplePool(pool, keys, name, game) : this.formatPool(pool, game)
    })
  },

  /**
   * 精简模式：仅保留包含 item 的那一行（保留该行完整内容）
   */
  formatSimplePool (pool, keys, name, game) {
    let ret = {
      version: pool.version,
      half: pool.half || '',
      from: pool.from || '',
      to: pool.to || '',
      isMix: pool.type === 'mixPoolDetail',
      groups: []
    }
    lodash.forEach(keys, (k) => {
      let names = pool[k] || []
      if (!names.includes(name)) {
        return
      }
      let g = poolGroups.find((g) => g.key === k)
      let rows = this.chunkRows(names, g.type, game)
      if (rows.length) {
        ret.groups.push({ title: g.title, star: g.star, rows })
      }
    })
    return ret
  }
}

export default GachaPool
