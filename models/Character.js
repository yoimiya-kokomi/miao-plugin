/*
* 角色数据
*
* 支持角色查询及Meta元数据获取
* 兼容处理自定义角色
* */
import lodash from 'lodash'
import Base from './Base.js'
import { Data } from '../components/index.js'
import CharImg from './character-lib/CharImg.js'
import CharTalent from './character-lib/CharTalent.js'
import CharId from './character-lib/CharId.js'
import CharMeta from './character-lib/CharMeta.js'
import CharCfg from './character-lib/CharCfg.js'

let { abbrMap, wifeMap, idSort, idMap } = CharId

let getMeta = function (name) {
  return Data.readJSON(`resources/meta/character/${name}/data.json`)
}

class Character extends Base {
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
      this.elem = CharId.getElem(elem || meta.elem) || 'anemo'
    } else {
      this.meta = {}
    }
    return this._cache()
  }

  // 默认获取的数据
  _dataKey = 'id,name,abbr,title,star,elem,allegiance,weapon,birthday,astro,cncv,jpcv,ver,desc,talentCons'

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

  // 获取武器类型
  get weaponType () {
    const map = {
      sword: '单手剑',
      catalyst: '法器',
      bow: '弓',
      claymore: '双手剑',
      polearm: '长柄武器'
    }
    let weaponType = this.weapon || ''
    return map[weaponType.toLowerCase()] || ''
  }

  // 获取元素名称
  get elemName () {
    return CharId.getElemName(this.elem)
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

  // 获取attr列表
  getAttrList () {
    let { meta } = this
    return CharMeta.getAttrList(meta.baseAttr, meta.growAttr, this.elemName)
  }

  // 获取素材
  getMaterials (type = 'all') {
    return CharMeta.getMaterials(this, type)
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

  // 获取角色character-img图片
  getCardImg (se = false, def = true) {
    if (this.name === '旅行者') {
      return CharImg.getCardImg(['空', '荧'], se, def)
    }
    return CharImg.getCardImg(this.name, se, def)
  }

  getAvatarTalent (talent = {}, cons = 0, mode = 'level') {
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
    if (!lodash.isArray(costume)) {
      costume = [costume, false]
    }
    let costumeCfg = [this.checkCostume(costume[0]) ? '2' : '', costume[1] || 'normal']

    let cacheId = `costume${costumeCfg.join('')}`
    if (!this._imgs) {
      this._imgs = {}
    }
    if (this._imgs[cacheId]) {
      return this._imgs[cacheId]
    }
    this._imgs[cacheId] = CharImg.getImgs(this.name, costumeCfg, this.isTraveler ? this.elem : '', this.source === 'amber' ? 'png' : 'webp')
    return this._imgs[cacheId]
  }

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

  // 设置旅行者数据
  // TODO：迁移至Avatar
  setTraveler (uid = '') {
    if (this.isTraveler && uid && uid.toString().length === 9) {
      Data.setCacheJSON(`miao:uid-traveler:${uid}`, {
        id: CharId.getTravelerId(this.id),
        elem: this.elem
      }, 3600 * 24 * 120)
    }
  }

  // 获取旅行者数据
  async getTraveler (uid) {
    if (this.isTraveler) {
      let tData = await Data.getCacheJSON(`miao:uid-traveler:${uid}`)
      return Character.get({
        id: CharId.getTravelerId(tData.id || this.id),
        elem: tData.elem || (this.elem !== 'multi' ? this.elem : 'anemo')
      })
    }
    return this
  }

  async checkAvatars (avatars, uid = '') {
    if (!this.isTraveler) {
      return this
    }
    if (lodash.isObject(avatars) && avatars.id) {
      avatars = [avatars]
    }
    for (let avatar of avatars) {
      if (CharId.isTraveler(avatar.id)) {
        let char = Character.get({
          id: avatar.id,
          elem: (avatar.elem || avatar.element || 'anemo').toLowerCase()
        })
        char.setTraveler(uid)
        return char
      }
    }
    return await this.getTraveler(uid)
  }

  // 基于角色名获取Character
  static get (val) {
    let id = CharId.getId(val)
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

  // 基于角色名获取Character
  // 当获取角色为旅行者时，会考虑当前uid的账号情况返回对应旅行者
  static async getAvatar (name, uid) {
    let char = Character.get(name)
    return await char.getTraveler(uid)
  }

  // 获取别名数据
  // TODO：待废弃
  static getAbbr () {
    return abbrMap
  }

  // 检查wife类型
  // TODO：待废弃
  static checkWifeType (charid, type) {
    return !!wifeMap[type][charid]
  }

  // 获取排序ID
  static sortIds (arr) {
    return arr.sort((a, b) => (idSort[a] || 300) - (idSort[b] || 300))
  }

  // 获取伤害计算配置
  async getCalcRule () {
    if (!this._calcRule && this._calcRule !== false) {
      this._calcRule = await CharCfg.getCalcRule(this)
    }
    return this._calcRule
  }

  static matchElem (str, def) {
    return CharId.matchElem(str, def)
  }

  static matchElemName () {

  }
}

Character.CharId = CharId

export default Character
