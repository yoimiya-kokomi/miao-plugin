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
    const key = this.key(profile, 'mark')
    let rank = await redis.zRevRank(key, this.uid)
    if (!lodash.isNumber(rank) || force) {
      let mark = profile.getArtisMark(false)
      if (mark) {
        await redis.zAdd(key, { score: mark._mark, value: this.uid })
        rank = await redis.zRevRank(key, this.uid)
      }
    }
    if (lodash.isNumber(rank)) {
      let count = await redis.zCard(key)
      let mark = await redis.zScore(key, this.uid)
      return {
        rank: rank + 1,
        count,
        value: Format.comma(mark, 1),
        _value: mark,
        pct: Format.percent(Math.max(0.01, Math.min(0.999, (count - rank) / count)))
      }
    }
    return false
  }
}
