import lodash from 'lodash'
import Base from './Base.js'
import moment from 'moment'
import { Data } from '../components/index.js'
import { Character, ProfileArtis, ProfileDmg } from './index.js'

export default class ProfileData extends Base {
  constructor (ds = {}) {
    super()
    let char = Character.get(ds.id)
    if (!char) {
      return false
    }
    this.id = char.id
    this.char = char

    this.setBasic(ds)
    ds.attr && this.setAttr(ds.attr)
    ds.weapon && this.setWeapon(ds.weapon)
    this.artis = new ProfileArtis(this.id)
    ds.artis && this.setArtis(ds.artis)
    ds.talent && this.setTalent(ds.talent)
  }

  setBasic (ds = {}) {
    this.level = ds.lv || ds.level || 1
    this.cons = ds.cons || 0
    this.fetter = ds.fetter || 0
    this.dataSource = ds.dataSource || 'enka'
    this._time = ds._time || ds.updateTime || new Date() * 1
  }

  setAttr (ds) {
    this.attr = lodash.extend(Data.getData(ds, 'atk,atkBase,def,defBase,hp,hpBase,mastery,recharge'), {
      heal: ds.heal || ds.hInc || 0,
      cpct: ds.cpct || ds.cRate,
      cdmg: ds.cdmg || ds.cDmg,
      dmg: ds.dmg || ds.dmgBonus || 0,
      phy: ds.phy || ds.phyBonus || 0
    })
  }

  setWeapon (ds = {}) {
    this.weapon = {
      name: ds.name,
      star: ds.rank || ds.star || 1,
      level: ds.level || ds.lv || 1,
      promote: ds.promote || 1,
      affix: ds.affix
    }
  }

  setArtis (ds = false) {
    if (ds) {
      this.artis.setArtisSet(ds)
    }
  }

  setTalent (ds = {}, mode = 'level') {
    this.talent = this.char.getAvatarTalent(ds, this.cons, mode)
  }

  get name () {
    return this.char?.name || ''
  }

  // 判断当前profileData是否具有有效数据
  get hasData () {
    // 检查数据源
    if (!this.dataSource || !['enka', 'input2', 'miao', 'miao-pre'].includes(this.dataSource)) {
      return false
    }
    // 检查旅行者
    if (['空', '荧'].includes(this.name)) {
      return false
    }
    // 检查属性
    if (!this.weapon || !this.attr || !this.talent || !this.artis) {
      return false
    }
    if (this.dataSource === 'miao-pre') {
      this.dataSource = 'miao'
    }
    return true
  }

  // 判断当前profileData是否具备有效圣遗物信息
  hasArtis () {
    return this.hasData && this.artis.length > 0
  }

  // toJSON 供保存使用
  toJSON () {
    return this.getData('id,name,level,cons,fetter,attr,weapon,talent,artis,dataSource,_time')
  }

  get updateTime () {
    let time = this._time
    if (!time) {
      return ''
    }
    if (lodash.isString(time)) {
      return moment(time).format('MM-DD HH:mm')
    }
    if (lodash.isNumber(time)) {
      return moment(new Date(time)).format('MM-DD HH:mm')
    }
    return ''
  }

  // 获取当前profileData的圣遗物评分，withDetail=false仅返回简略信息
  getArtisMark (withDetail = true) {
    return this.artis.getMarkDetail(withDetail)
  }

  // 计算当前profileData的伤害信息
  async calcDmg ({ enemyLv = 91, mode = 'profile', dmgIdx = 0 }) {
    if (!this.dmg) {
      let ds = this.getData('id,level,attr,cons,artis:artis.sets')
      ds.talent = lodash.mapValues(this.talent, 'level')
      ds.weapon = Data.getData(this.weapon, 'name,affix')
      this.dmg = new ProfileDmg(ds)
    }
    return await this.dmg.calcData({ enemyLv, mode, dmgIdx })
  }
}
