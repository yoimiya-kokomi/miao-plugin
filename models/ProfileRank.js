import lodash from 'lodash'
import moment from 'moment'
import { Common } from '../components/index.js'

export default class ProfileRank {
  constructor (data) {
    this.groupId = data.groupId || data.groupId || ''
    if (!this.groupId || this.groupId === 'undefined') {
      return false
    }
    this.qq = data.qq
    this.uid = data.uid + ''
    this.allowRank = false
  }

  static async create (data) {
    let rank = new ProfileRank(data)
    rank.allowRank = await ProfileRank.checkRankLimit(rank.uid)
    return rank
  }

  key (profile, type) {
    return `miao:rank:${this.groupId}:${type}:${profile.id}`
  }

  /**
   * 获取排行信息
   * @param profile
   * @param force
   * @returns {Promise<{}|boolean>}
   */
  async getRank (profile, force = false) {
    if (!this.groupId || !this.allowRank || !profile.hasData) {
      return false
    }
    let ret = {}
    for (let typeKey of ['mark', 'dmg']) {
      let typeRank = await this.getTypeRank(profile, typeKey, force)
      ret[typeKey] = typeRank
      if (!ret.rank || ret.rank >= typeRank.rank) {
        ret.rank = typeRank.rank
        ret.rankType = typeKey
      }
    }
    return ret
  }

  async getTypeRank (profile, type, force) {
    if (!profile.hasData || !type) {
      return false
    }
    if (type === 'dmg' && !profile.hasDmg) {
      return false
    }
    const typeKey = this.key(profile, type)
    let value
    let rank
    if (force) {
      value = await this.getTypeValue(profile, type)
    } else {
      rank = await redis.zRevRank(typeKey, this.uid)
      if (!lodash.isNumber(rank)) {
        value = await this.getTypeValue(profile, type)
      }
    }
    if (value && !lodash.isUndefined(value.score)) {
      await redis.zAdd(typeKey, { score: value.score, value: this.uid })
    }
    if (!lodash.isNumber(rank)) {
      rank = await redis.zRevRank(typeKey, this.uid)
    }
    if (force) {
      return {
        rank: rank + 1,
        value: value.score,
        data: value.data
      }
    }
    return {
      rank: rank + 1
    }
  }

  async getTypeValue (profile, type) {
    if (type === 'mark') {
      let mark = profile.getArtisMark(false)
      if (mark && mark._mark) {
        return {
          score: mark._mark * 1,
          data: mark
        }
      }
    }
    if (type === 'dmg' && profile.hasDmg) {
      let dmg = await profile.calcDmg({ mode: 'single' })
      if (dmg && dmg.avg) {
        return {
          score: dmg.avg,
          data: dmg
        }
      }
    }
    return false
  }

  /**
   * 获取群排行UID
   * @param groupId
   * @param charId
   * @param type
   * @returns {Promise<string|boolean>}
   */
  static async getGroupMaxUid (groupId, charId, type = 'mark') {
    let uids = await redis.zRange(`miao:rank:${groupId}:${type}:${charId}`, -1, -1)
    return uids ? uids[0] : false
  }

  /**
   * 获取排行榜
   * @param groupId
   * @param charId
   * @param type
   * @returns {Promise<ConvertArgumentType<ZMember, string>[]|boolean>}
   */
  static async getGroupUidList (groupId, charId, type = 'mark') {
    let uids = await redis.zRangeWithScores(`miao:rank:${groupId}:${type}:${charId}`, -15, -1)
    return uids ? uids.reverse() : false
  }

  /**
   * 重置群排行
   * @param groupId
   * @param charId
   * @returns {Promise<void>}
   */
  static async resetRank (groupId, charId = '') {
    let keys = await redis.keys(`miao:rank:${groupId}:*`)
    for (let key of keys) {
      let charRet = /^miao:rank:\d+:(?:mark|dmg):(\d{8})$/.exec(key)
      if (charRet) {
        if (charId === '' || charId * 1 === charRet[1] * 1) {
          await redis.del(key)
        }
      }
    }
    if (charId === '') {
      await redis.del(`miao:rank:${groupId}:cfg`)
    }
  }

  static async getGroupCfg (groupId) {
    const rankLimitTxt = {
      1: '无限制',
      2: '面板列表中至少有16个角色的数据',
      3: '面板列表中有 安柏&凯亚&丽莎 的数据',
      4: '面板列表至少有16个角色数据，且包含安柏&凯亚&丽莎'
    }
    let rankLimit = Common.cfg('groupRankLimit') * 1 || 1
    let ret = {
      timestamp: (new Date()) * 1,
      limitTxt: rankLimitTxt[rankLimit],
      status: 0
    }
    try {
      let cfg = await redis.get(`miao:rank:${groupId}:cfg`)
      if (!cfg) {
        await redis.set(`miao:rank:${groupId}:cfg`, JSON.stringify(ret), { EX: 3600 * 24 * 365 })
      } else {
        ret = JSON.parse(cfg)
      }
    } catch (e) {
    }
    ret.time = moment(new Date(ret.timestamp)).format('MM-DD HH:mm')
    return ret
  }

  static async setRankLimit (uid, profiles) {
    if (!uid) {
      return false
    }
    let basicCount = 0
    let totalCount = 0
    for (let charId in profiles) {
      let profile = profiles[charId]
      if (!profile || !profile.hasData) {
        continue
      }
      if (['安柏', '凯亚', '丽莎'].includes(profile.name)) {
        basicCount++
      }
      totalCount++
    }
    await redis.set(`miao:rank:uid-info:${uid}`, JSON.stringify({
      totalCount,
      basicCount
    }), { EX: 3600 * 24 * 365 })
  }

  static async checkRankLimit (uid) {
    if (!uid) {
      return false
    }
    try {
      let rankLimit = Common.cfg('groupRankLimit') * 1 || 1
      if (rankLimit === 1) {
        return true
      }
      let data = await redis.get(`miao:rank:uid-info:${uid}`)
      data = JSON.parse(data)
      if ((data.totalCount || 0) < 16 && [2, 4].includes(rankLimit)) {
        return false
      }
      if ((data.basicCount || 0) < 3 && [3, 4].includes(rankLimit)) {
        return false
      }
      return true
    } catch (e) {
      return false
    }
  }
}
