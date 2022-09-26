/*
* 用户角色封装
* 兼容处理面板 Profile Data 及 Mys Avatar 数据
* */
import Base from './Base.js'
import lodash from 'lodash'
import { Profile } from '../components/index.js'
import { Artifact, Character, Weapon, ArtifactSet } from './index.js'
import moment from 'moment'

const charKey = 'name,abbr,sName,star,imgs,face,side,gacha,weaponType,elem'.split(',')

export default class Avatar extends Base {
  constructor (data = {}, pd = false, hasCk = true) {
    super()
    if (!data.name) {
      return false
    }
    let char = Character.get(data.name)
    if (!char || char.isCustom) {
      return false
    }
    this.meta = data
    this.char = char
    let isProfile = data.isProfile
    this.dataType = isProfile ? 'profile' : 'avatar'
    this.hasCk = hasCk
    let profile
    let uid
    if (isProfile) {
      profile = data
    } else if (pd) {
      if (pd.isProfile) {
        profile = pd
      } else if (/\d{9}/.test(pd)) {
        uid = pd
        profile = Profile.get(pd, char.id, true)
      }
    }
    if (profile && profile.isProfile && profile.hasData) {
      this.profile = profile
    }
    this.elem = ((profile && profile.elem) || data.element || data.elem || char.elem || 'anemo').toLowerCase()
    if (char.isTraveler) {
      this.char = Character.get({ id: data.id || char.id, elem: this.elem })
      uid && char.setTraveler(uid)
    }
  }

  _get (key) {
    if (charKey.includes(key)) {
      return this.char[key]
    }
    return this.meta[key]
  }

  get dataSourceName () {
    if (!this.hasCk && this.profile) {
      return this.profile.dataSourceName
    }
    return this.meta.dataSourceName || '米游社'
  }

  get updateTime () {
    if ((!this.hasCk || this.isProfile) && this.profile) {
      return this.profile.updateTime
    }
    return moment(new Date()).format('MM-DD HH:mm')
  }

  get isProfile () {
    return this.dataType === 'profile'
  }

  get isAvatar () {
    return this.dataType === 'avatar'
  }

  get artis () {
    let ret = {}
    if (!this.isProfile) {
      lodash.forEach(this.meta.reliquaries, (ds) => {
        let arti = Artifact.get(ds.name)
        ret[arti.idx] = {
          name: arti.name,
          set: arti.setName,
          img: arti.img,
          level: ds.level
        }
      })
      return ret
    }
    if (this.profile && this.profile?.artis) {
      return this.profile.artis.getArtisData()
    }
    return false
  }

  get cons () {
    let data = this.meta
    let profile = this.profile
    return data?.cons || data?.actived_constellation_num || profile?.cons || 0
  }

  get weapon () {
    let wd = this.meta?.weapon || this.profile?.weapon
    if (!wd || !wd.name) {
      return {}
    }
    let weapon = Weapon.get(wd.name)
    return {
      name: wd.name,
      abbr: weapon.abbr,
      star: weapon.star,
      level: wd.level || 1,
      affix: wd.affix || wd.affix_level || 0,
      type: weapon.type,
      img: weapon.img
    }
  }

  async getTalent (mys) {
    if (!this.isProfile && mys && mys.isSelfCookie) {
      let char = this.char
      let id = char.id
      let talent = {}
      let talentRes = await mys.getDetail(id)
      let avatar = this.meta
      if (!char || !avatar) {
        return {}
      }
      if (talentRes && talentRes.skill_list) {
        let talentList = lodash.orderBy(talentRes.skill_list, ['id'], ['asc'])
        for (let val of talentList) {
          let { max_level: maxLv, level_current: lv } = val
          if (val.name.includes('普通攻击')) {
            talent.a = lv
            continue
          }
          if (maxLv >= 10 && !talent.e) {
            talent.e = lv
            continue
          }
          if (maxLv >= 10 && !talent.q) {
            talent.q = lv
            continue
          }
        }
      }
      let ret = char.getAvatarTalent(talent, this.cons, 'original')
      ret.id = id
      return ret
    }
    if (this.profile) {
      let profile = this.profile
      let talent = profile.talent
      talent.id = profile.id
      return talent
    }
    return false
  }

  get artisSet () {
    if (this._artisSet) {
      return this._artisSet
    }
    this._artisSet = false
    if (!this.isProfile) {
      let artis = this.artis
      let setCount = {}
      lodash.forEach(artis, (arti, idx) => {
        let set = arti?.set
        if (set) {
          setCount[set] = (setCount[set] || 0) + 1
        }
      })
      let sets = {}
      let names = []
      let abbrs = []
      let abbrs2 = []
      let imgs = []
      for (let set in setCount) {
        if (setCount[set] >= 2) {
          let value = setCount[set] >= 4 ? 4 : 2
          sets[set] = value
          let artiSet = ArtifactSet.get(set)
          names.push(artiSet.name)
          abbrs.push(artiSet.abbr + value)
          abbrs2.push(artiSet.name + value)
          imgs.push(artiSet.img)
        }
      }
      this._artisSet = {
        sets,
        names,
        abbrs: [...abbrs, ...abbrs2],
        imgs,
        name: abbrs.length > 1 ? abbrs.join('+') : abbrs2[0]
      }
    }
    if (this.profile) {
      let profile = this.profile
      this._artisSet = profile.artis ? profile.artis.getSetData() : false
    }
    return this._artisSet || {}
  }
}