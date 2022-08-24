import lodash from 'lodash'
import fs from 'fs'
import sizeOf from 'image-size'
import Base from './Base.js'
import { Data } from '../components/index.js'

let aliasMap = {}
let idMap = {}
let abbrMap = {}
let wifeMap = {}
const _path = process.cwd()
const metaPath = `${_path}/plugins/miao-plugin/resources/meta/character/`

async function init() {
  let { sysCfg, diyCfg } = await Data.importCfg('character')
  lodash.forEach([diyCfg.customCharacters, sysCfg.characters], (roleIds) => {
    lodash.forEach(roleIds || {}, (aliases, id) => {
      aliases = aliases || []
      if (aliases.length === 0) {
        return
      }
      // 建立别名映射
      lodash.forEach(aliases || [], (alias) => {
        alias = alias.toLowerCase()
        aliasMap[alias] = id
      })
      aliasMap[id] = id
      idMap[id] = aliases[0]
    })
  })

  lodash.forEach([sysCfg.wifeData, diyCfg.wifeData], (wifeData) => {
    lodash.forEach(wifeData || {}, (ids, type) => {
      type = Data.def({ girlfriend: 0, boyfriend: 1, daughter: 2, son: 3 }[type], type)
      if (!wifeMap[type]) {
        wifeMap[type] = {}
      }
      Data.eachStr(ids, (id) => {
        id = aliasMap[id]
        if (id) {
          wifeMap[type][id] = true
        }
      })
    })
  })
  abbrMap = sysCfg.abbr
}

await init()

class Character extends Base {
  constructor(name, id) {
    super()

    if (id * 1 === 10000005) {
      name = '空'
    } else if (id * 1 === 10000007) {
      name = '荧'
    }
    this.name = name
    lodash.extend(this, getMeta(name))
    if (name === '主角' || name === '旅行者' || /.主/.test(name)) {
      this.id = 20000000
    }
    this.id = id
  }

  get weaponType() {
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

  get isCustom() {
    return !/10\d{6}/.test(this.id)
  }

  get abbr() {
    return abbrMap[this.name] || this.name
  }

  getCardImg(se = false, def = true) {
    let name = this.name
    let list = []
    let addImg = function (charImgPath, disable = false) {
      let dirPath = `./plugins/miao-plugin/resources/${charImgPath}`

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
      }
      if (disable) {
        return
      }

      let imgs = fs.readdirSync(dirPath)
      imgs = imgs.filter((img) => /\.(png|jpg|webp|jpeg)/i.test(img))
      lodash.forEach(imgs, (img) => {
        list.push(`${charImgPath}/${img}`)
      })
    }
    addImg(`character-img/${name}`)
    addImg(`character-img/${name}/upload`)
    addImg(`character-img/${name}/se`, !se)

    const plusPath = './plugins/miao-plugin/resources/miao-res-plus/'
    if (fs.existsSync(plusPath)) {
      addImg(`miao-res-plus/character-img/${name}`)
      addImg(`miao-res-plus/character-img/${name}/se`, !se)
    }

    let img = lodash.sample(list)

    if (!img) {
      if (def) {
        img = '/character-img/default/01.jpg'
      } else {
        return false
      }
    }

    let ret = sizeOf(`./plugins/miao-plugin/resources/${img}`)
    ret.img = img
    ret.mode = ret.width > ret.height ? 'left' : 'bottom'
    return ret
  }

  checkAvatars(avatars) {
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

  getAvatarTalent(talent = {}, cons = 0, mode = 'level') {
    let ret = {}
    let consTalent = this.getConsTalent()
    lodash.forEach(['a', 'e', 'q'], (key) => {
      let ds = talent[key]
      if (!ds) {
        ds = 1
      }
      let level
      if (lodash.isNumber(ds)) {
        level = ds
      } else {
        level = mode === 'level' ? ds.level || ds.level_current || ds.original || ds.level_original : ds.original || ds.level_original || ds.level || ds.level_current
      }
      if (mode === 'level') {
        // 基于level计算original
        ret[key] = {
          level,
          original: (key !== 'a' && cons >= consTalent[key]) ? (level - 3) : level
        }
      } else {
        // 基于original计算level
        ret[key] = {
          original: level,
          level: (key !== 'a' && cons >= consTalent[key]) ? (level + 3) : level
        }
      }

    })
    if (this.id * 1 !== 10000033) {
      let a = ret.a || {}
      if (a.level > 10) {
        a.level = 10
        a.original = 10
      }
    }
    if (this.id * 1 === 10000033) {
      let a = ret.a || {}
      a.original = a.level - 1
    }
    return ret
  }

  getConsTalent() {
    let talent = this.talent || false
    if (!talent) {
      return { e: 3, q: 5 }
    }
    let e = talent.e.name
    let q = talent.q.name
    let c3 = this.cons['3'].desc
    let c5 = this.cons['5'].desc
    return {
      e: c3.includes(e) ? 3 : 5,
      q: c5.includes(q) ? 5 : 3
    }
  }

  checkWifeType(type) {
    return !!wifeMap[type][this.id]
  }
}

let getMeta = function (name) {
  return Data.readJSON(`${_path}/plugins/miao-plugin/resources/meta/character/${name}/`, 'data.json') || {}
}

Character.get = function (val) {
  let id, name
  if (!val) {
    return false
  }
  if (typeof (val) === 'number' || /^\d*$/.test(val)) {
    id = val
  } else if (val.id) {
    id = val.id
    name = val.name || idMap[id]
  } else {
    id = aliasMap[val]
  }
  if (!name) {
    name = idMap[id]
  }
  if (!name) {
    return false
  }
  return new Character(name, id)
}

Character.getAbbr = function () {
  return abbrMap
}

Character.checkWifeType = function (charid, type) {
  return !!wifeMap[type][charid]
}

Character.getRandomImg = function (type) {
  let chars = fs.readdirSync(metaPath)
  let ret = []
  type = type === 'party' ? 'party' : 'profile'
  lodash.forEach(chars, (char) => {
    if (fs.existsSync(`${metaPath}/${char}/${type}.png`)) {
      ret.push(`/meta/character/${char}/${type}.png`)
    }
  })
  return lodash.sample(ret)
}

let charPosIdx = {
  1: '宵宫,雷神,胡桃,甘雨,优菈,一斗,公子,绫人,魈,可莉,迪卢克,凝光,刻晴,辛焱,烟绯,雷泽',
  2: '夜兰,八重,九条,行秋,香菱,安柏,凯亚,丽莎,北斗,菲谢尔,重云,罗莎莉亚,埃洛伊',
  3: '申鹤,莫娜,早柚,云堇,久岐忍,五郎,砂糖,万叶,温迪',
  4: '班尼特,心海,琴,芭芭拉,七七,迪奥娜,托马,空,荧,阿贝多,钟离'
}

let idSort = {}
lodash.forEach(charPosIdx, (chars, pos) => {
  chars = chars.split(',')
  lodash.forEach(chars, (name, idx) => {
    let id = aliasMap[name]
    if (id) {
      idSort[id] = pos * 100 + idx
    }
  })
})

Character.sortIds = function (arr) {
  return arr.sort((a, b) => (idSort[a] || 300) - (idSort[b] || 300))
}

export default Character
