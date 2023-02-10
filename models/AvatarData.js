import lodash from 'lodash'
import Base from './Base.js'
import moment from 'moment'
import { Character, AvatarArtis, ProfileData, Weapon } from './index.js'
import { Data } from '../components/index.js'
import AttrCalc from './profile-lib/AttrCalc.js'
import Profile from './player-lib/Profile.js'

const charKey = 'name,abbr,sName,star,imgs,face,side,gacha,weaponTypeName'.split(',')

export default class AvatarData extends Base {
  constructor (ds = {}, source) {
    super()
    let char = Character.get({ id: ds.id, elem: ds.elem })
    if (!char) {
      return
    }
    this.id = char.id
    this.char = char
    this.initArtis()
    this.setAvatar(ds, source)
  }

  /**
   * 当前数据是否需要更新天赋
   * @returns {boolean}
   */
  get needRefreshTalent () {
    // 不存在天赋数据
    if (!this.hasTalent) {
      return true
    }
    // 超过2个小时的天赋数据进行请求
    return (new Date() * 1) - this._talent > 3600 * 2 * 1000
  }

  get hasTalent () {
    return this.talent && !lodash.isEmpty(this.talent) && !!this._talent
  }

  get name () {
    return this.char?.name || ''
  }

  // 是否是合法面板数据
  get isProfile () {
    return Profile.isProfile(this)
  }

  get costume () {
    let costume = this._costume
    if (lodash.isArray(costume)) {
      costume = costume[0]
    }
    return costume
  }

  get originalTalent () {
    return lodash.mapValues(this.talent, (ds) => ds.original)
  }

  /**
   * 获取圣遗物套装属性
   * @returns {boolean|*|{imgs: *[], names: *[], sets: {}, abbrs: *[], sName: string, name: (string|*)}|{}}
   */
  get artisSet () {
    return this.artis.getSetData()
  }

  get dataSource () {
    return {
      enka: 'Enka.Network',
      miao: '喵喵Api',
      mys: '米游社'
    }[this._source] || this._source
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

  static create (ds, source) {
    let avatar = new AvatarData(ds)
    if (!avatar) {
      return false
    }
    return avatar
  }

  initArtis () {
    this.artis = new AvatarArtis(this.id)
  }

  _get (key) {
    if (charKey.includes(key)) {
      return this.char[key]
    }
  }

  setAvatar (ds, source = '') {
    this._now = new Date() * 1
    this.setBasic(ds, source)
    ds.weapon && this.setWeapon(ds.weapon)
    ds.talent && this.setTalent(ds.talent, 'original', source)
    ds.artis && this.setArtis(ds)
    delete this._now
  }

  /**
   * 设置角色基础数据
   * @param ds
   * @param source
   */
  setBasic (ds = {}, source = '') {
    const now = this._now || (new Date()) * 1
    this.level = ds.lv || ds.level || this.level || 1
    this.cons = ds.cons || this.cons || 0
    this.fetter = ds.fetter || this.fetter || 0
    this._costume = ds.costume || this._costume || 0
    this.elem = ds.elem || this.elem || this.char.elem || ''
    this.promote = lodash.isUndefined(ds.promote) ? (this.promote || AttrCalc.calcPromote(this.level)) : (ds.promote || 0)

    this._source = ds._source || ds.dataSource || this._source || ''
    this._time = ds._time || this._time || now
    this._update = ds._update || this._update || ds._time || now
    this._talent = ds._talent || this._talent || ds._time || now
    // 存在数据源时更新时间
    if (source) {
      this._update = now
      if (source !== 'mys') {
        this._source = source
        this._time = now
      } else {
        this._source = this._source || source
        this._time = this._source !== 'mys' ? (this._time || now) : now
      }
    }
  }

  setWeapon (ds = {}) {
    let w = Weapon.get(ds.name)
    if (!w) {
      return false
    }
    this.weapon = {
      name: ds.name,
      level: ds.level || ds.lv || 1,
      promote: lodash.isUndefined(ds.promote) ? AttrCalc.calcPromote(ds.level || ds.lv || 1) : (ds.promote || 0),
      affix: ds.affix,
      ...w.getData('star,abbr,type,img')
    }
    if (this.weapon.level < 20) {
      this.weapon.promote = 0
    }
  }

  setTalent (ds = {}, mode = 'original', source = '') {
    const now = this._now || (new Date()) * 1
    let ret = this.char.getAvatarTalent(ds, this.cons, mode)
    if (!ret) {
      return false
    }
    this.talent = ret || this.talent
    // 设置天赋更新时间
    this._talent = ds._talent || this._talent || ds._time || now
    if (source && ret) {
      this._talent = now
    }
  }

  setArtis (ds, source) {
    this.artis.setArtisData(ds.artis, source)
  }

  getProfile () {
    if (!this.isProfile) {
      return false
    }
    return ProfileData.create(this)
  }

  // 判断当前profileData是否具备有效圣遗物信息
  hasArtis () {
    return this.isProfile && this.artis.length > 0
  }

  // toJSON 供保存使用
  toJSON () {
    return {
      ...this.getData('name,id,elem,level,promote,fetter,costume,cons,talent:originalTalent'),
      weapon: Data.getData(this.weapon, 'name,level,promote,affix'),
      ...this.getData('artis,_source,_time,_update,_talent')
    }
  }

  getDetail (keys = '') {
    return this.getData(keys || 'id,name,level,star,cons,fetter,elem,face,side,gacha,abbr,weapon,talent,artisSet') || {}
  }

  getArtisDetail () {
    return this.artis.getDetail()
  }
}
