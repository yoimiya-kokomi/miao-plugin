import lodash from 'lodash'
import AvatarBase from './avatar/AvatarBase.js'
import { Data, Cfg } from '#miao'
import { ProfileDmg } from './index.js'
import Attr from './attr/Attr.js'
import CharImg from './character/CharImg.js'
import Artis from './artis/Artis.js'

export default class Avatar extends AvatarBase {
  constructor (ds = {}, game = 'gs', calc = true) {
    super(ds, game)
    this._artis = new Artis(this.game, true)
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

  get artis () {
    return this._artis
  }

  static create (ds, game = 'gs', calc = true) {
    let profile = new Avatar(ds, game, calc)
    if (!profile) {
      return false
    }
    return profile
  }

  setAvatar (ds, source = '') {
    super.setAvatar(ds, source)
    if (ds.artis) {
      this._artis.setArtisData(ds.artis)
    }
    // this.calcAttr()
  }

  calcAttr () {
    this._attr = Attr.create(this)
    this.attr = this._attr.calc(this)
    this.base = this._attr.getBase()
  }

  getArtis (isMysArtis = false) {
    return isMysArtis ? this._mysArtis : this._artis
  }

  setArtis (ds = {}, isMysArtis = false) {
    let artis = this.getArtis(isMysArtis)
    artis.setArtisData(ds)
  }

  // 获取当前profileData的圣遗物评分，withDetail=false仅返回简略信息
  getArtisMark (withDetail = true) {
    if (this.hasData) {
      return this.artis.getMarkDetail(this, withDetail)
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

  // toJSON 供保存使用
  toJSON () {
    let keys = this.isGs ?
      'name,id,elem,level,promote,fetter,costume,cons,talent:originalTalent' :
      'name,id,elem,level,promote,cons,talent:originalTalent,trees'
    let ret = {
      ...this.getData(keys),
      weapon: Data.getData(this.weapon, this.isGs ? 'name,level,promote,affix' : 'id,level,promote,affix'),
      artis: this.artis.toJSON()
    }
    if (!this.mysArtis.isSameArtis(this.artis)) {
      ret.mysArtis = this.mysArtis.toJSON()
    }
    return {
      ...ret,
      ...this.getData('_source,_time,_update,_talent')
    }
  }
}
