/*
* 用户角色
* 抹平Profile及Mys Avatar
* */
import Base from './Base.js'
import lodash from 'lodash'
import { Artifact, Character, Weapon } from './index.js'
import moment from 'moment'

const charKey = 'name,abbr,sName,star,imgs,weaponType,elem'.split(',')

export default class Avatar extends Base {
  constructor (data = {}) {
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
    this.dataType = data.dataSource ? 'profile' : 'avatar'
  }

  _get (key) {
    if (charKey.includes(key)) {
      return this.char[key]
    }
    return this.meta[key]
  }

  get dataSourceName () {
    return this.meta.dataSourceName || 'MysApi'
  }

  get updateTime () {
    let meta = this.meta
    return this.isProfile ? meta.updateTime : moment(new Date()).format('MM-DD HH:mm')
  }

  get isProfile () {
    return this.dataType === 'profile'
  }

  get isAvatar () {
    return this.dataType === 'avatar'
  }

  get artis () {
    if (this.isProfile && this.meta?.artis) {
      return this.meta.artis.toJSON()
    }
    if (this._artis) {
      return this._artis
    }
    let ret = {}
    const posIdx = {
      生之花: 1,
      死之羽: 2,
      时之沙: 3,
      空之杯: 4,
      理之冠: 5
    }
    lodash.forEach(this.meta.reliquaries, (ds) => {
      let idx = posIdx[ds.pos_name]
      ret[idx] = {
        name: ds.name,
        set: Artifact.getSetByArti(ds.name),
        level: ds.level
      }
    })
    this._artis = ret
    return this._artis;
  }

  get cons () {
    let data = this.meta
    return this.isProfile ? data.cons : data.actived_constellation_num
  }

  get weapon () {
    let wd = this.meta.weapon
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

  async getTalent (MysApi) {
    if (this.isProfile) {
      return this.talent
    }
    let char = this.char
    let id = char.id
    let talent = {}
    let talentRes = await MysApi.getDetail(id)
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
    let ret = char.getAvatarTalent(talent, avatar.cons, 'original')
    ret.id = id
    return ret
  }
}
