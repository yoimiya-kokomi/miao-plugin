import lodash from 'lodash'

import { Data } from '#miao'
import { ProfileDmg } from './index.js'
import AvatarBase from './avatar/AvatarBase.js'
import Attr from './attr/Attr.js'
import Artis from './artis/Artis.js'
import ProfileAvatar from './avatar/ProfileAvatar.js'
import ArtisMark from './artis/ArtisMark.js'

export default class Avatar extends AvatarBase {
  constructor (ds = {}, game = 'gs') {
    super(ds, game)
    this._artis = new Artis(this.game, true)
  }

  get isAvatar () {
    return true
  }

  // 是否是合法面板数据
  get isProfile () {
    return ProfileAvatar.isProfile(this)
  }

  // profile.hasData 别名
  get hasData () {
    return !!(this.level > 1 || this?.weapon?.name || this?.talent?.a)
  }

  get imgs () {
    return this.char.getImgs(this.costume) || {}
  }

  get costumeSplash () {
    return ProfileAvatar.getCostumeSplash(this)
  }

  get hasDmg () {
    return this.isProfile && !!ProfileDmg.dmgRulePath(this.name, this.game)
  }

  get artis () {
    return this._artis
  }

  static create (ds, game = 'gs') {
    let profile = new Avatar(ds, game)
    if (!profile) {
      return false
    }
    return profile
  }

  setAvatar (ds, source = '') {
    super.setAvatar(ds, source)
    if (ds.artis && source !== 'mys') {
      this._artis.setArtisData(ds.artis)
    }
    this.calcAttr()
  }

  calcAttr () {
    if (!this.isProfile) {
      return false
    }
    let attr = this._attr = this._attr || Attr.create(this)
    this.attr = attr.calc()
    this.base = attr.getBase()
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
    return ArtisMark.getMarkDetail(this, withDetail)
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
