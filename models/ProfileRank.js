import lodash from 'lodash'
import moment from 'moment'

export default class ProfileRank {
  constructor (data) {
    this.groupId = data.groupId || data.groupId
    this.qq = data.qq
    this.uid = data.uid + ''
  }

  static async create (data) {
    return new ProfileRank(data)
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
    if (!profile.hasData) {
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
    if (value && value.score) {
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
    let ret = {
      timestamp: (new Date()) * 1,
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
}
