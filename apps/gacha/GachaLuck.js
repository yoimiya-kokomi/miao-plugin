/*
* 抽卡欧皇度
*
* 按官方公示概率及社区统计的软保底模型，计算“与你获得同样数量UP（或五星）的玩家中，
* 花费抽数比你多的玩家占比”，即运气超过了多少玩家
* */
import lodash from 'lodash'
import { Data } from '#miao'

let { sysCfg, diyCfg } = await Data.importCfg('gacha')
// 数组（评级档位）整体覆盖，不按下标合并
let luckCfg = lodash.mergeWith({}, sysCfg.luckCfg, diyCfg.luckCfg, (obj, src) => lodash.isArray(src) ? src : undefined)

let distCache = {}

// 卷积，结果只保留下标 0~limit
const conv = function (a, b, limit) {
  let ret = new Array(Math.min(a.length + b.length - 1, limit + 1)).fill(0)
  for (let i = 0; i < a.length && i <= limit; i++) {
    if (!a[i]) continue
    for (let j = 0; j < b.length && i + j <= limit; j++) {
      ret[i + j] += a[i] * b[j]
    }
  }
  return ret
}

let GachaLuck = {
  getModel (game, type) {
    return luckCfg?.model?.[game]?.[type]
  },

  // 单个五星所需抽数的概率分布 f[i]
  getFiveDist (m) {
    let key = `five:${m.base},${m.soft},${m.step},${m.hard}`
    if (!distCache[key]) {
      let f = [0]
      let survive = 1
      for (let i = 1; i <= m.hard; i++) {
        let p = i >= m.hard ? 1 : Math.min(1, m.base + Math.max(0, i - m.soft + 1) * m.step)
        f[i] = survive * p
        survive *= 1 - p
      }
      distCache[key] = f
    }
    return distCache[key]
  },

  // 单个UP所需抽数的概率分布：小保底不歪直接出UP，歪了再抽一个大保底
  getUpDist (m) {
    let key = `up:${m.base},${m.soft},${m.step},${m.hard},${m.upRate}`
    if (!distCache[key]) {
      let f = GachaLuck.getFiveDist(m)
      let ff = conv(f, f, m.hard * 2)
      distCache[key] = ff.map((v, i) => (f[i] || 0) * m.upRate + v * (1 - m.upRate))
    }
    return distCache[key]
  },

  getExpect (dist) {
    return lodash.sum(dist.map((p, i) => p * i))
  },

  // 获得 num 个目标花费 used 抽时，运气超过的玩家比例（0~100）
  getPercent (dist, num, used) {
    if (!(num > 0) || !(used > 0)) {
      return false
    }
    if (num > 50) {
      // 样本较大时用正态近似，避免精确计算耗时过长
      let mean = GachaLuck.getExpect(dist)
      let variance = lodash.sum(dist.map((p, i) => p * (i - mean) * (i - mean)))
      let z = (used - num * mean) / Math.sqrt(num * variance)
      return Math.min(100, Math.max(0, (1 - GachaLuck.normCdf(z)) * 100))
    }
    let total = [1]
    for (let i = 0; i < num; i++) {
      total = conv(total, dist, used)
    }
    let below = 0
    for (let i = 0; i < used && i < total.length; i++) {
      below += total[i]
    }
    let equal = total[used] || 0
    return Math.min(100, Math.max(0, (1 - below - equal / 2) * 100))
  },

  // 标准正态分布累积概率
  normCdf (z) {
    let t = 1 / (1 + 0.2316419 * Math.abs(z))
    let d = 0.3989422804014327 * Math.exp(-z * z / 2)
    let p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))))
    return z > 0 ? 1 - p : p
  },

  // 小保底不歪次数的二项分布百分位
  getWinPercent (num, win, rate) {
    if (!(num > 0)) {
      return false
    }
    let below = 0
    let equal = 0
    let c = 1 // 组合数 C(num, k)
    for (let k = 0; k <= num; k++) {
      if (k > 0) {
        c = c * (num - k + 1) / k
      }
      let p = c * Math.pow(rate, k) * Math.pow(1 - rate, num - k)
      if (k < win) {
        below += p
      } else if (k === win) {
        equal = p
      }
    }
    return Math.min(100, Math.max(0, (below + equal / 2) * 100))
  },

  /**
   * @param data.isUpPool 是否为UP池（角色/武器/光锥）
   * @param data.upNum UP数量
   * @param data.upUsed 获得这些UP花费的抽数
   * @param data.fiveNum 五星数量
   * @param data.fiveUsed 获得这些五星花费的抽数
   * @param data.smallNum 小保底次数
   * @param data.smallWin 小保底不歪次数
   */
  get (data) {
    let { game, type, isUpPool } = data
    let m = GachaLuck.getModel(game, type)
    if (!luckCfg?.enable || !m) {
      return false
    }
    isUpPool = isUpPool && m.upRate > 0
    let fiveDist = GachaLuck.getFiveDist(m)
    let fiveExpect = GachaLuck.getExpect(fiveDist)
    let fivePercent = GachaLuck.getPercent(fiveDist, data.fiveNum, data.fiveUsed)
    if (fivePercent === false) {
      return false
    }
    let ret = {
      isUpPool,
      fiveAvg: (data.fiveUsed / data.fiveNum).toFixed(1),
      fiveExpect: fiveExpect.toFixed(1),
      fivePercent: fivePercent.toFixed(1)
    }
    let percent = fivePercent
    let sample = data.fiveNum
    if (isUpPool) {
      let upDist = GachaLuck.getUpDist(m)
      let upPercent = GachaLuck.getPercent(upDist, data.upNum, data.upUsed)
      if (upPercent === false) {
        // 还没有出过UP，退回按出金评级
        isUpPool = ret.isUpPool = false
      } else {
        percent = upPercent
        sample = data.upNum
        let winPercent = GachaLuck.getWinPercent(data.smallNum, data.smallWin, m.upRate)
        lodash.extend(ret, {
          upAvg: (data.upUsed / data.upNum).toFixed(1),
          upExpect: GachaLuck.getExpect(upDist).toFixed(1),
          upRate: Math.round(m.upRate * 100),
          winPercent: winPercent === false ? false : winPercent.toFixed(1)
        })
      }
    }
    let level = lodash.find(luckCfg.levels || [], (ds) => percent >= ds.min) || lodash.last(luckCfg.levels)
    if (!level) {
      return false
    }
    return {
      ...level,
      ...ret,
      percent: percent.toFixed(1),
      fewSample: sample < (luckCfg.minSample || 0)
    }
  }
}

export default GachaLuck
