import lodash from 'lodash'
import AvatarData from './AvatarData.js'
import { Data } from '../components/index.js'
import { ProfileArtis, ProfileDmg } from './index.js'
import AttrCalc from './profile/AttrCalc.js'
import CharImg from './character/CharImg.js'

export default class ProfileData extends AvatarData {
  constructor (ds = {}, calc = true) {
    super(ds)
    if (calc) {
      this.calcAttr()
    }
  }

  // 判断当前profileData是否具有有效数据
  get hasData () {
    return this.isProfile
  }

  get imgs(){
    return this.char.getImgs(this.costume)
  }

  get costumeSplash () {
    let costume = this._costume
    costume = this.char.checkCostume(costume) ? '2' : ''

    let nPath = `meta/character/${this.name}`
    let isSuper = false
    let talent = this.talent ? lodash.map(this.talent, (ds) => ds.original).join('') : ''
    if (this.cons === 6 || ['ACE', 'ACE²'].includes(this.artis?.markClass) || talent === '101010') {
      isSuper = true
    }
    if (isSuper) {
      return CharImg.getRandomImg(
        [`profile/super-character/${this.name}`, `profile/normal-character/${this.name}`],
        [`${nPath}/imgs/splash0.webp`, `${nPath}/imgs/splash${costume}.webp`, `/${nPath}/imgs/splash.webp`]
      )
    } else {
      return CharImg.getRandomImg(
        [`profile/normal-character/${this.name}`],
        [`${nPath}/imgs/splash${costume}.webp`, `/${nPath}/imgs/splash.webp`]
      )
    }
  }

  get hasDmg () {
    return this.hasData && !!ProfileDmg.dmgRulePath(this.name)
  }

  static create (ds) {
    let profile = new ProfileData(ds)
    if (!profile) {
      return false
    }
    return profile
  }

  initArtis () {
    this.artis = new ProfileArtis(this.id, this.elem)
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

  calcAttr () {
    this._attr = AttrCalc.create(this)
    this.attr = this._attr.calc()
  }

  setArtis (ds = false) {
    this.artis?.setProfile(this, ds.artis?.artis || ds.artis || ds)
  }

  // 获取当前profileData的圣遗物评分，withDetail=false仅返回简略信息
  getArtisMark (withDetail = true) {
    if (this.hasData) {
      return this.artis.getMarkDetail(withDetail)
    }
    return {}
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
