import lodash from 'lodash'
import Base from './Base.js'
import { Data } from '../components/index.js'
import CharImg from './character-lib/CharImg.js'
import CharTalent from './character-lib/CharTalent.js'
import CharId from './character-lib/CharId.js'

const _path = process.cwd()
let { abbrMap, wifeMap, idSort } = CharId

class Character extends Base {
  constructor ({ id, name = '', elem = '' }) {
    super()
    let uuid = CharId.isTraveler(id) ? `character:${id}:${elem || 'anemo'}` : `character:${id}`
    // 检查缓存
    let cacheObj = Base.get(uuid)
    if (cacheObj) {
      return cacheObj
    }
    // 设置数据
    this.id = id
    this.name = name
    this._uuid = uuid
    if (!this.isCustom) {
      let meta = getMeta(name)
      this.meta = meta
      for (let key of this._dataKey.split(',')) {
        if (key === 'elem') {
          this.elem = elem || meta.elem
        } else {
          this[key] = meta[key]
        }
      }
    } else {
      this.meta = {}
    }
    return this._expire()
  }

  _dataKey = 'id,name,abbr,title,star,elem,allegiance,weapon,birthday,astro,cncv,jpcv,ver,desc,talentCons'

  // 是否为自定义角色
  get isCustom () {
    return !/[12]0\d{6}/.test(this.id)
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

  // 获取头像
  get face () {
    return this.getImgs().face
  }

  // 获取侧脸图像
  get side () {
    return this.getImgs().side
  }

  // 获取详情数据
  get detail () {
    return this.getDetail()
  }

  // 获取基础数据
  get baseAttr () {
    return this.meta.baseAttr
  }

  // 获取成长数据
  get growAttr () {
    return this.meta.growAttr
  }

  // 获取角色character-img图片
  getCardImg (se = false, def = true) {
    return CharImg.getCardImg(this.name, se, def)
  }

  checkAvatars (avatars) {
    if (!lodash.includes([20000000, 10000005, 10000007], this.id * 1)) {
      return
    }
    let avatarIds = []
    if (lodash.isArray(avatars)) {
      avatarIds = lodash.map(avatars, (a) => a.id * 1)
    } else {
      avatarIds = [avatars.id]
    }

    if (lodash.includes(avatarIds, 10000005)) {
      // 空
      lodash.extend(this, getMeta('空'))
    } else if (lodash.includes(avatarIds, 10000007)) {
      // 荧
      lodash.extend(this, getMeta('荧'))
    }
  }

  getAvatarTalent (talent = {}, cons = 0, mode = 'level') {
    return CharTalent.getAvatarTalent(this.id, talent, cons, mode, this.talentCons)
  }

  checkWifeType (type) {
    return !!wifeMap[type][this.id]
  }

  checkCostume (id) {
    let costume = this.meta?.costume || []
    return costume.includes(id * 1)
  }

  // 获取Character图像资源
  getImgs (costume = '', elem = '') {
    let cId = this.checkCostume(costume) ? '2' : ''
    if (this._imgs) {
      return this._imgs
    }
    this._imgs = CharImg.getImgs(this.name, cId, this.isTraveler ? this.elem : '')
    return this._imgs
  }

  // 获取详情数据
  getDetail (elem = '') {
    if (this._detail) {
      return this._detail
    }
    if (this.isCustom) {
      return {}
    }
    const path = `${_path}/plugins/miao-plugin/resources/meta/character/${this.name}`

    try {
      if (this.isTraveler) {
        this._detail = Data.readJSON(`${path}/${this.elem}`, 'detail.json') || {}
      } else {
        this._detail = Data.readJSON(`${path}`, 'detail.json') || {}
      }
    } catch (e) {
      console.log(e)
    }
    return this._detail
  }

  getTalentKey (id) {
    let meta = this.meta
    return meta.talentKey[meta.talentId[id]] || false
  }

  getTalentElem () {

  }
}

let getMeta = function (name) {
  return Data.readJSON(`${_path}/plugins/miao-plugin/resources/meta/character/${name}/`, 'data.json') || {}
}

Character.get = function (val) {
  let id = CharId.getId(val)
  if (!id) {
    return false
  }
  return new Character(id)
}

Character.getAbbr = function () {
  return abbrMap
}

Character.checkWifeType = function (charid, type) {
  return !!wifeMap[type][charid]
}

Character.sortIds = function (arr) {
  return arr.sort((a, b) => (idSort[a] || 300) - (idSort[b] || 300))
}

export default Character
