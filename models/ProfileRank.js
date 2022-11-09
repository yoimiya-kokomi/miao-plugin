import { Format } from '../components/index.js'
import lodash from 'lodash'

export default class ProfileRank {
  constructor (data) {
    this.group = data.group || data.groupId
    this.qq = data.qq
    this.uid = data.uid + ''
  }

  static async create (data) {
    return new ProfileRank(data)
  }

  key (profile, type) {
    return `miao:rank:${this.group}:${type}:${profile.id}`
  }

  async getRank (profile, force = false) {
    if (!profile.hasData) {
      return false
    }
    let ret = {}
    const markKey = this.key(profile, 'mark')
    let markRank = await redis.zRevRank(markKey, this.uid)
    if (!lodash.isNumber(markRank) || force) {
      let mark = profile.getArtisMark(false)
      if (mark) {
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
        if (dmg) {
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

  static async getGroupMaxUid (groupId, charId, type = 'mark') {
    return await redis.zRange(`miao:rank:${groupId}:${type}:${charId}`, -1, -1)
  }
}
