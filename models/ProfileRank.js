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
    const markKey = this.key(profile, 'mark')
    let markRank = await redis.zRevRank(markKey, this.uid)
    if (!lodash.isNumber(markRank) || force) {
      let mark = profile.getArtisMark(false)
      if (mark && mark._mark) {
        await redis.zAdd(markKey, { score: mark._mark, value: this.uid })
        markRank = await redis.zRevRank(markKey, this.uid)
      }
    }
    if (lodash.isNumber(markRank)) {
      let markCount = await redis.zCard(markKey)
      ret.markRank = markRank + 1
      ret.markCount = markCount
    }
    if (profile.hasDmg) {
      const dmgKey = this.key(profile, 'dmg')
      let dmgRank = await redis.zRevRank(dmgKey, this.uid)
      if (!lodash.isNumber(dmgRank) || force) {
        let dmg = await profile.calcDmg({ mode: 'single' })
        if (dmg && dmg.avg) {
          await redis.zAdd(dmgKey, { score: dmg.avg, value: this.uid })
          dmgRank = await redis.zRevRank(dmgKey, this.uid)
        }
      }
      if (lodash.isNumber(dmgRank)) {
        let dmgCount = await redis.zCard(dmgKey)
        ret.dmgRank = dmgRank + 1
        ret.dmgCount = dmgCount
      }
    }
    if (lodash.isEmpty(ret)) {
      return false
    }
    if (!ret.dmgRank || ret.markRank < ret.dmgRank) {
      ret.rank = ret.markRank
      ret.rankType = 'mark'
    } else {
      ret.rank = ret.dmgRank
      ret.rankType = 'dmg'
    }
    return ret
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
    let uids = await redis.zRangeWithScores(`miao:rank:${groupId}:${type}:${charId}`, -10, -1)
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
