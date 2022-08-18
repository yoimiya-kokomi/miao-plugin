import Base from './Base.js'
import lodash from 'lodash'
import { Data, Common } from '../components/index.js'
import { Artifact, Character } from './index.js'

export default class Avatars extends Base {
  constructor (uid, datas = []) {
    super()
    if (!uid) {
      return false
    }
    this.uid = uid
    let avatars = {}
    let abbr = Character.getAbbr()
    lodash.forEach(datas, (avatar) => {
      let data = Data.getData(avatar, 'id,name,level,star:rarity,cons:actived_constellation_num,fetter')
      data.abbr = abbr[data.name] || data.name
      data.elem = (avatar.element || '').toLowerCase() || 'hydro'
      data.weapon = Data.getData(avatar.weapon, 'name,affix:affix_level,level,star:rarity')
      data.weapon.abbr = abbr[data?.weapon?.name || ''] || data?.weapon?.name
      if (data.star > 5) {
        data.star = 5
      }
      let artis = {}
      let setCount = {}
      lodash.forEach(avatar.reliquaries, (arti) => {
        artis[arti.pos] = Data.getData(arti, 'name,level,set:set.name')
        setCount[arti.set.name] = (setCount[arti.set.name] || 0) + 1
      })
      data.artis = artis
      data.sets = {}
      data.names = []
      for (let set in setCount) {
        if (setCount[set] >= 2) {
          data.sets[set] = setCount[set] >= 4 ? 4 : 2
          data.names.push(Artifact.getArtiBySet(set))
        }
      }
      avatars[data.id] = data
    })
    this.avatars = avatars
  }

  getData (ids) {
    let rets = {}
    let avatars = this.avatars
    lodash.forEach(ids, (id) => {
      rets[id] = avatars[id] || {}
    })
    return rets
  }

  getIds () {
    let rets = []
    lodash.forEach(this.avatars, (ds) => {
      rets.push(ds.id)
    })
    return rets
  }

  async getTalentData (ids, MysApi = false) {
    let avatarTalent = {}
    let talentCache = await redis.get(`genshin:avatar-talent:${this.uid}`)
    if (talentCache) {
      avatarTalent = JSON.parse(talentCache)
    }
    let needReq = {}
    lodash.forEach(ids, (id) => {
      if (!avatarTalent[id]) {
        needReq[id] = true
      }
    })
    let needReqIds = lodash.keys(needReq)
    if (needReqIds.length > 0 && MysApi && MysApi.isSelfCookie) {
      let num = 10
      let ms = 100
      let skillRet = []
      let avatarArr = lodash.chunk(needReqIds, num)
      for (let val of avatarArr) {
        for (let id of val) {
          skillRet.push(this.getAvatarTalent(id, MysApi))
        }
        skillRet = await Promise.all(skillRet)
        skillRet = skillRet.filter(item => item.id)
        await Common.sleep(ms)
      }
      lodash.forEach(skillRet, (talent) => {
        avatarTalent[talent.id] = talent
      })
      await redis.set(`genshin:avatar-talent:${this.uid}`, JSON.stringify(avatarTalent), { EX: 3600 * 2 })
    }
    let ret = this.getData(ids)
    lodash.forEach(ret, (avatar, id) => {
      avatar.talent = avatarTalent[id] || { a: {}, e: {}, q: {} }
    })
    return ret
  }

  async getAvatarTalent (id, MysApi) {
    let talent = { id, a: {}, e: {}, q: {} }
    let talentRes = await MysApi.getDetail(id)
    let char = Character.get(id)
    let avatar = this.avatars[id]
    if (!char || !avatar) {
      return talent
    }
    let consTalent = char.getConsTalent()
    if (talentRes && talentRes.skill_list) {
      talent.id = id
      let talentList = lodash.orderBy(talentRes.skill_list, ['id'], ['asc'])
      for (let val of talentList) {
        let { max_level: maxLv, level_current: lv } = val
        let ds = {
          current: lv,
          original: lv,
          crown: lv === maxLv
        }
        if (val.name.includes('普通攻击')) {
          talent.a = ds
          continue
        }
        if (maxLv >= 10 && !talent.e?.current) {
          talent.e = ds
          continue
        }
        if (maxLv >= 10 && !talent.q?.current) {
          talent.q = ds
          continue
        }
      }
      lodash.forEach([3, 5], (c) => {
        if (avatar.cons >= c) {
          if (consTalent.e === c) {
            talent.e.current += 3
            talent.e.plus = true
          } else if (consTalent.q === c) {
            talent.q.current += 3
            talent.q.plus = true
          }
        }
      })
    }
    return talent
  }
}

Avatars.hasTalentCache = async function (uid) {
  return !!await redis.get(`genshin:avatar-talent:${uid}`)
}
