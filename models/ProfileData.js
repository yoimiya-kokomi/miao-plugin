import lodash from 'lodash'
import Base from './Base.js'
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
    this.updateTime = ds.updateTime || new Date() * 1
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

  get hasData () {
    if (!['enka', 'input2', 'miao'].includes(this.dataSource)) {
      return false
    }
    if (['空', '荧'].includes(this.name)) {
      return false
    }
    return true
  }

  hasArtis () {
    return this.hasData && this.artis.length > 0
  }

  toJSON () {
    return this.getData('id,name,level,cons,fetter,attr,weapon,talent,artis,updateTime,dataSource')
  }

  getArtisMark (withDetail = true) {
    return this.artis.getMarkDetail(withDetail)
  }

  async calcDmg ({ enemyLv = 91, mode = 'profile', dmgIdx = 0 }) {
    if (!this.dmg) {
      this.dmg = new ProfileDmg(this)
    }
    return await this.dmg.calcData({ enemyLv, mode, dmgIdx })
  }
}
