/*
* 角色数据
*
* 支持角色查询及Meta元数据获取
* 兼容处理自定义角色
* */
import lodash from 'lodash'
import Base from './Base.js'
import { Data, Format } from '../components/index.js'
import CharImg from './character/CharImg.js'
import CharTalent from './character/CharTalent.js'
import CharId from './character/CharId.js'
import CharMeta from './character/CharMeta.js'
import CharCfg from './character/CharCfg.js'

let { wifeMap, idSort, idMap } = CharId

let getMeta = function (name) {
  return Data.readJSON(`resources/meta/character/${name}/data.json`)
}

class Character extends Base {
  // 默认获取的数据
  _dataKey = 'id,name,abbr,title,star,elem,allegiance,weapon,birthday,astro,cncv,jpcv,ver,desc,talentCons'

  constructor ({ id, name = '', elem = '' }) {
    super()
    // 检查缓存
    let cacheObj = this._getCache(CharId.isTraveler(id) ? `character:${id}:${elem || 'anemo'}` : `character:${id}`)
    if (cacheObj) {
      return cacheObj
    }
    // 设置数据
    this._id = id
    this.name = name
    if (!this.isCustom) {
      let meta = getMeta(name)
      this.meta = meta
      this.elem = Format.elem(elem || meta.elem, 'anemo')
    } else {
      this.meta = {}
    }
    return this._cache()
  }

  // 是否为官方角色
  get isOfficial () {
    return /[12]0\d{6}/.test(this._id)
  }

  // 是否为实装官方角色
  get isRelease () {
    if (this.isCustom) {
      return false
    }
    if (this.eta) {
      return this.eta * 1 < new Date() * 1
    }
    return true
  }

  // 是否为自定义角色
  get isCustom () {
    return !/[12]0\d{6}/.test(this._id)
  }

  get id () {
    return this.isCustom ? this._id : this._id * 1
  }

  // 获取短名字
  get sName () {
    let name = this.name
    let abbr = this.abbr
    return name.length <= 4 ? name : (abbr || name)
  }

  // 是否是旅行者
  get isTraveler () {
    return CharId.isTraveler(this.id)
  }

  get weaponType () {
    return this.weapon
  }

  // 获取武器类型
  get weaponTypeName () {
    const map = {
      sword: '单手剑',
      catalyst: '法器',
      bow: '弓',
      claymore: '双手剑',
      polearm: '长柄武器'
    }
    let weaponType = this.weaponType || ''
    return map[weaponType.toLowerCase()] || ''
  }

  // 获取元素名称
  get elemName () {
    return Format.elemName(this.elem)
  }

  // 获取角色描述
  get desc () {
    return CharMeta.getDesc(this.meta.desc || '')
  }

  // 获取头像
  get face () {
    return this.getImgs().face
  }

  // 获取侧脸图像
  get side () {
    return this.getImgs().side
  }

  // gacha图像
  get gacha () {
    return this.getImgs().gacha
  }

  // 获取character相关图像
  get imgs () {
    return this.getImgs()
  }

  // 获取详情数据
  get detail () {
    return this.getDetail()
  }

  // 获取命座天赋等级
  get talentCons () {
    if (this.isTraveler) {
      return this.elem === 'dendro' ? { e: 3, q: 5 } : { e: 5, q: 3 }
    }
    return this.meta?.talentCons || {}
  }

  // 获取生日
  get birthday () {
    let birth = this.birth
    if (!birth) {
      return ''
    }
    birth = birth.split('-')
    return `${birth[0]}月${birth[1]}日`
  }

  // 基于角色名获取Character
  static get (val) {
    let id = CharId.getId(val, Character.gsCfg)
    if (!id) {
      return false
    }
    return new Character(id)
  }

  static forEach (fn, type = 'all') {
    lodash.forEach(idMap, (name, id) => {
      let char = Character.get({ id, name })
      if (type === 'release' && !char.isRelease) {
        return true
      }
      if (type === 'official' && !char.isOfficial) {
        return true
      }
      return fn(char) !== false
    })
  }

  // 获取排序ID
  static sortIds (arr) {
    return arr.sort((a, b) => (idSort[a] || 300) - (idSort[b] || 300))
  }

  // 获取attr列表
  getAttrList () {
    let { meta } = this
    return CharMeta.getAttrList(meta.baseAttr, meta.growAttr, this.elemName)
  }

  // 获取素材
  getMaterials (type = 'all') {
    return CharMeta.getMaterials(this, type)
  }

  // 获取角色character-img图片
  getCardImg (se = false, def = true) {
    if (this.name === '旅行者') {
      return CharImg.getCardImg(['空', '荧'], se, def)
    }
    return CharImg.getCardImg(this.name, se, def)
  }

  // 设置旅行者数据

  getAvatarTalent (talent = {}, cons = 0, mode = 'original') {
    return CharTalent.getAvatarTalent(this.id, talent, cons, mode, this.talentCons)
  }

  // 检查老婆类型
  checkWifeType (type) {
    return !!wifeMap[type][this.id]
  }

  // 检查时装
  checkCostume (id) {
    let costume = this.meta?.costume || []
    return costume.includes(id * 1)
  }

  // 判断是否为某种元素角色
  isElem (elem = '') {
    elem = elem.toLowerCase()
    return this.elem === elem || this.elemName === elem
  }

  // 获取角色插画
  getImgs (costume = '') {
    if (lodash.isArray(costume)) {
      costume = costume[0]
    }
    let costumeIdx = this.checkCostume(costume) ? '2' : ''
    let cacheId = `costume${costumeIdx}`
    if (!this._imgs) {
      this._imgs = {}
    }
    if (!this._imgs[cacheId]) {
      this._imgs[cacheId] = CharImg.getImgs(this.name, costumeIdx, this.isTraveler ? this.elem : '', this.source === 'amber' ? 'png' : 'webp')
    }
    return this._imgs[cacheId]
  }

  // 基于角色名获取Character

  // 获取详情数据
  getDetail (elem = '') {
    if (this._detail) {
      return this._detail
    }
    if (this.isCustom) {
      return {}
    }
    const path = 'resources/meta/character'

    try {
      if (this.isTraveler) {
        this._detail = Data.readJSON(`${path}/旅行者/${this.elem}/detail.json`)
      } else {
        this._detail = Data.readJSON(`${path}/${this.name}/detail.json`)
      }
    } catch (e) {
      console.log(e)
    }
    return this._detail
  }

  // 获取伤害计算配置
  getCalcRule () {
    if (!this._calcRule && this._calcRule !== false) {
      this._calcRule = CharCfg.getCalcRule(this)
    }
    return this._calcRule
  }

  getArtisCfg () {
    if (!this._artisRule && this._artisRule !== false) {
      this._artisRule = CharCfg.getArtisCfg(this)
    }
    return this._artisRule
  }
}

Character.CharId = CharId

export default Character
