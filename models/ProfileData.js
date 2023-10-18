import lodash from 'lodash'
import AvatarData from './AvatarData.js'
import { Data, Cfg } from '#miao'
import { ProfileArtis, AvatarArtis, ProfileDmg } from './index.js'
import AttrCalc from './profile/AttrCalc.js'
import CharImg from './character/CharImg.js'

export default class ProfileData extends AvatarData {
  constructor (ds = {}, game = 'gs', calc = true) {
    super(ds, game)
    if (calc) {
      this.calcAttr()
    }
  }

  // 判断当前profileData是否具有有效数据
  get hasData () {
    return this.isProfile
  }

  get imgs () {
    return this.char.getImgs(this.costume) || {}
  }

  get costumeSplash () {
    let costume = this._costume
    costume = this.char.checkCostume(costume) ? '2' : ''

    if (!Cfg.get('costumeSplash', true)) {
      return this.char.getImgs(this._costume).splash
    }

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
    return this.hasData && !!ProfileDmg.dmgRulePath(this.name, this.game)
  }

  get mysArtis(){
    return this._mysArtis
  }

  get artis () {
    return this._artis
  }

  static create (ds, game = 'gs', calc = true) {
    let profile = new ProfileData(ds, game, calc)
    if (!profile) {
      return false
    }
    return profile
  }

  initArtis () {
    this._artis = new ProfileArtis(this.id, this.elem, this.game)
    this._mysArtis = new AvatarArtis(this.id, this.game)
  }

  calcAttr () {
    this._attr = AttrCalc.create(this)
    this.attr = this._attr.calc()
    this.base = this._attr.getBase()
  }

  setArtis (ds = false, isMysArtis = false) {
    if (isMysArtis) {
      this.mysArtis.setArtis(ds.artis?.artis || ds.artis || ds)
    } else {
      this.artis?.setProfile(this, ds.artis?.artis || ds.artis || ds)
    }
  }

  // 获取当前profileData的圣遗物评分，withDetail=false仅返回简略信息
  getArtisMark (withDetail = true) {
    if (this.hasData) {
      return this.artis.getMarkDetail(withDetail)
    }
    return {}
  }

  // 计算当前profileData的伤害信息
  async calcDmg ({ enemyLv = 91, mode = 'profile', dmgIdx = 0, idxIsInput = false }) {
    if (!this.dmg) {
      let ds = this.getData('id,level,attr,cons,artis:artis.sets,trees')
      ds.talent = lodash.mapValues(this.talent, 'level')
      ds.weapon = Data.getData(this.weapon, 'name,affix')
      this.dmg = new ProfileDmg(ds, this.game)
    }
    return await this.dmg.calcData({ enemyLv, mode, dmgIdx, idxIsInput })
  }
}
