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
  }
}

export default GachaPool
