import lodash from 'lodash'
import moment from 'moment'
import { Cfg, Common, Data, Version } from '#miao'

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

  static async getGroupMaxUidList (groupId, type = 'mark') {
    let keys = await redis.keys(`miao:rank:${groupId}:${type}:*`)
    let ret = []
    for (let key of keys) {
      let keyRet = /^miao:rank:[\w-]+:(?:mark|dmg|crit|valid):(\d{8})$/.exec(key)
      if (keyRet && keyRet[1]) {
        let charId = keyRet[1]
        let uid = await ProfileRank.getGroupMaxUid(groupId, charId, type)
        if (uid) {
          ret.push({
            uid,
            charId
          })
        }
      }
    }
    return ret
  }

  /**
   * 获取排行榜
   * @param groupId
   * @param charId
   * @param type
   * @returns {Promise<ConvertArgumentType<ZMember, string>[]|boolean>}
   */
  static async getGroupUidList (groupId, charId, type = 'mark') {
    let number = Cfg.get('rankNumber', 15)
    let uids = await redis.zRangeWithScores(`miao:rank:${groupId}:${type}:${charId}`, -`${number}`, -1)
    return uids ? uids.reverse() : false
  }

  /**
   * 重置群排行
   * @param groupId
   * @param charId
   * @returns {Promise<void>}
   */
  static async resetRank (groupId, charId = '', game = 'gs') {
    let keys = await redis.keys(`miao:rank:${groupId}:*`)
    for (let key of keys) {
      let charRet = game === 'gs' ? /^miao:rank:\d+:(?:mark|dmg|crit|valid):(\d{8})$/.exec(key) : /^miao:rank:\d+:(?:mark|dmg|crit|valid):(\d{4})$/.exec(key)
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
      2: '绑定有CK的用户',
      3: '绑定CK，或列表有16个角色数据',
      4: '绑定CK，或列表有安柏&凯亚&丽莎的数据',
      5: '绑定CK，或列表有16个角色数据且包含安柏&凯亚&丽莎'
    }
    let rankLimit = Common.cfg('groupRankLimit') * 1 || 1
    let ret = await Data.redisGet(`miao:rank:${groupId}:cfg`, {
      timestamp: (new Date()) * 1,
      status: 0
    })
    await Data.redisSet(`miao:rank:${groupId}:cfg`, ret, 3600 * 24 * 365)
    ret.limitTxt = rankLimitTxt[rankLimit]
    ret.time = moment(new Date(ret.timestamp)).format('MM-DD HH:mm')
    ret.number = Cfg.get('rankNumber', 15)
    return ret
  }

  /**
   * 设置群开关状态
   * @param groupId
   * @param status：0开启，1关闭
   * @returns {Promise<void>}
   */
  static async setGroupStatus (groupId, status = 0) {
    let cfg = await Data.redisGet(`miao:rank:${groupId}:cfg`, {
      timestamp: (new Date()) * 1,
      status
    })
    cfg.status = status
    await Data.redisSet(`miao:rank:${groupId}:cfg`, cfg, 3600 * 24 * 365)
  }

  static async setUidInfo ({ uid, qq, profiles, uidType = 'bind' }) {
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
    let data = {}
    try {
      let uData = await redis.get(`miao:rank:uid-info:${uid}`)
      if (uData) {
        data = JSON.parse(uData)
      }
    } catch (e) {
      data = {}
    }
    data.totalCount = totalCount
    data.basicCount = basicCount
    if (data.isSelfUid) {
      delete data.isSelfUid
      data.uidType = 'ck'
    }

    if (uidType === 'ck') {
      data.uidType = 'ck'
      data.qq = qq || data.qq || ''
    } else {
      data.uidType = data.uidType || 'bind'
      if (data.uidType === 'bind') {
        data.qq = data.qq || qq || ''
      } else {
        data.qq = qq || data.qq || ''
      }
    }
    await redis.set(`miao:rank:uid-info:${uid}`, JSON.stringify(data), { EX: 3600 * 24 * 365 })
  }

  static async delUidInfo (uid) {
    let keys = await redis.keys('miao:rank:*')
    uid = uid + ''
    if (!/\d{9}/.test(uid)) {
      return false
    }
    for (let key of keys) {
      let charRet = /^miao:rank:\d+:(?:mark|dmg|crit|valid):(\d{8})$/.exec(key)
      if (charRet) {
        await redis.zRem(key, uid)
      }
    }
  }

  static async getUidInfo (uid) {
    try {
      let data = await redis.get(`miao:rank:uid-info:${uid}`)
      return JSON.parse(data)
    } catch (e) {
    }
    return false
  }

  static async getUserUidMap (e, game = 'gs') {
    let rn = e.runtime
    let groupMemMap = await e.group?.getMemberMap() || []
    let users = {}
    for (let [qq] of groupMemMap) {
      users[qq] = true
    }

    let uidMap = {}
    let qqMap = {}
    let add = (qq, uid, type) => {
      uidMap[uid] = { uid, qq, type: type === 'ck' ? 'ck' : 'bind' }
      qqMap[qq] = true
    }

    let keys = await redis.keys('miao:rank:uid-info:*')
    for (let key of keys) {
      let data = await Data.redisGet(key)
      let { qq, uidType } = data
      if (!users[qq]) continue
      let uidRet = /miao:rank:uid-info:(\d{9})/.exec(key)
      if (qq && uidType && uidRet?.[1]) {
        add(qq, uidRet[1], uidType === 'ck' ? 'ck' : 'bind')
      }
    }

    if (rn.NoteUser) {
      // Miao-Yunzai
      await rn.NoteUser.forEach(async (user) => {
        if (!users[user.qq]) return true
        let uids = user.getUidList(game)
        lodash.forEach(uids, (ds) => {
          let { uid, type } = ds
          add(user.qq, uid, type)
        })
      })
    } else {
      if (rn?.gsCfg?.getBingCk) {
        // Yunzai-V3
        let noteCks = await rn.gsCfg.getBingCk(game) || {}
        lodash.forEach(noteCks.ck, (ck, _qq) => {
          let qq = ck.qq || _qq
          let uid = ck.uid
          if (!users[qq]) return true
          add(qq, uid, 'ck')
        })
      }
    }

    for (let qq in users) {
      if (qqMap[qq]) continue
      let uid = await redis.get(Version.isV3 ? `Yz:genshin:mys:qq-uid:${qq}` : `genshin:id-uid:${qq}`)
      if (uid) {
        add(qq, uid, 'bind')
      }
    }

    return uidMap
  }

  /**
   * 1: '无限制',
   * 2: '绑定有CK的用户',
   * 3: '面板列表有16个角色数据，或绑定CK',
   * 4: '面板列表有安柏&凯亚&丽莎的数据，或绑定CK',
   * 5: '面板列表有16个角色数据且包含安柏&凯亚&丽莎，或绑定CK'
   * @param uid
   * @returns {Promise<boolean>}
   */
  static async checkRankLimit (uid) {
    if (!uid) {
      return false
    }
    // 预设面板不参与排名
    if (uid * 1 < 100000006) {
      return false
    }
    try {
      let rankLimit = Common.cfg('groupRankLimit') * 1 || 1
      if (rankLimit === 1) {
        return true
      }
      let data = await redis.get(`miao:rank:uid-info:${uid}`)
      data = JSON.parse(data)
      if (data.isSelfUid || data.uidType === 'ck') {
        return true
      }
      if (rankLimit === 2) {
        return false
      }
      if ((data.totalCount || 0) < 16 && [3, 5].includes(rankLimit)) {
        return false
      }
      if ((data.basicCount || 0) < 3 && [4, 5].includes(rankLimit)) {
        return false
      }
      return true
    } catch (e) {
      return false
    }
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
    if (!profile || !this.groupId || !this.allowRank || !profile.hasData) {
      return false
    }
    let ret = {}
    for (let typeKey of ['mark', 'dmg', 'crit', 'valid']) {
      let typeRank = await this.getTypeRank(profile, typeKey, force)
      if (['mark', 'dmg'].includes(typeKey)) {
        ret[typeKey] = typeRank
        if (!ret.rank || ret.rank >= typeRank.rank) {
          ret.rank = typeRank.rank
          ret.rankType = typeKey
        }
      }
    }
    return ret
  }

  async getTypeRank (profile, type, force) {
    if (!profile || !profile.hasData || !type) {
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
    if (rank === null) {
      rank = 99
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
    if (!profile || !profile.hasData) {
      return false
    }
    if (type === 'mark') {
      if (!profile?.artis?.hasArtis) {
        return false
      }
      let mark = profile.getArtisMark(false)
      if (mark && mark._mark) {
        return {
          score: mark.mark * 1,
          data: mark
        }
      }
    }
    if (type === 'crit') {
      if (!profile?.artis?.hasArtis) {
        return false
      }
      let mark = profile.getArtisMark(false)
      if (mark && mark._crit) {
        return {
          score: mark._crit * 1,
          data: mark
        }
      }
    }
    if (type === 'valid') {
      if (!profile?.artis?.hasArtis) {
        return false
      }
      let mark = profile.getArtisMark(false)
      if (mark && mark._valid) {
        return {
          score: mark._valid * 1,
          data: mark
        }
      }
    }
    if (type === 'dmg' && profile.hasDmg) {
      let enemyLv = profile.game === 'gs' ? 91 : 80
      let dmg = await profile.calcDmg({ enemyLv, mode: 'single' })
      if (dmg && dmg.avg) {
        return {
          score: dmg.avg,
          data: dmg
        }
      }
    }
    return false
  }
}
