import { segment } from 'oicq'
import lodash from 'lodash'
import Calendar from './wiki/Calendar.js'
import { Format, Cfg, Common, App } from '../components/index.js'
import { Character } from '../models/index.js'
import CharWiki from './wiki/CharWiki.js'

// eslint-disable-next-line no-unused-vars
let action = {
  wiki: {
    keyword: '命座|天赋|技能|资料|照片|写真|图片|插画'
  }
}
let wikiReg = /^(?:#|喵喵)?(.*)(天赋|技能|命座|命之座|资料|图鉴|照片|写真|图片|图像)$/

let app = App.init({
  id: 'wiki',
  name: '角色资料'
})
app.reg('wiki', wiki, {
  rule: '^#喵喵WIKI$',
  check: checkCharacter,
  desc: '【#资料】 #神里天赋 #夜兰命座'
})
app.reg('calendar', calendar, {
  rule: /^(#|喵喵)+(日历|日历列表)$/,
  desc: '【#日历】 活动日历'
})

export default app

function checkCharacter (e) {
  let msg = e.original_msg || e.msg
  if (!e.msg) {
    return false
  }
  let ret = wikiReg.exec(msg)
  console.log(msg, ret)
  if (!ret || !ret[1] || !ret[2]) {
    return false
  }
  let mode = 'talent'
  if (/命/.test(ret[2])) {
    mode = 'cons'
  } else if (/(图鉴|资料)/.test(ret[2])) {
    mode = 'wiki'
  } else if (/图|画|写真|照片/.test(ret[2])) {
    mode = 'pic'
  } else if (/(材料|养成|成长)/.test(ret[2])) {
    mode = 'material'
  }

  if ((mode === 'pic' && Common.isDisable(e, 'wiki.pic')) ||
      (mode !== 'pic' && Common.isDisable(e, 'wiki.wiki'))) {
    return false
  }

  let char = Character.get(ret[1])
  if (!char) {
    return false
  }
  e.wikiMode = mode
  e.msg = '#喵喵WIKI'
  e.char = char
  return true
}

async function wiki (e) {

  let mode = e.wikiMode
  let char = e.char

  if (mode === 'pic') {
    let img = char.getCardImg(Cfg.get('char.se', false), false)
    if (img && img.img) {
      e.reply(segment.image(process.cwd() + '/plugins/miao-plugin/resources/' + img.img))
    } else {
      e.reply('暂无图片')
    }
    return true
  }
  if (char.isCustom) {
    if (mode === 'wiki') {
      return false
    }
    e.reply('暂不支持自定义角色')
    return true
  }
  let lvs = []
  for (let i = 1; i <= 15; i++) {
    lvs.push('Lv' + i)
  }
  if (mode === 'wiki') {
    if (char.source === 'amber') {
      e.reply('暂不支持该角色图鉴展示')
      return true
    }
    return await renderWiki({ e, char })
  } else if (mode === 'material') {
    return await renderCharMaterial({ e, char })
  }
  return await Common.render('wiki/character-talent', {
    saveId: `${mode}-${char.id}`,
    ...char.getData(),
    detail: char.getDetail(),
    imgs: char.getImgs(),
    mode,
    lvs,
    line: getLineData(char)
  }, { e, scale: 1.1 })
}

async function renderWiki ({ e, char }) {
  let data = char.getData()
  lodash.extend(data, char.getData('weaponType,elemName'))
  // 命座持有
  let holding = await CharWiki.getHolding(char.id)
  let weapons = await CharWiki.getWeapons(char.id)
  let artis = await CharWiki.getArtis(char.id)

  return await Common.render('wiki/character-wiki', {
    // saveId: `info-${char.id}`,
    data,
    attr: char.getAttrList(),
    detail: char.getDetail(),
    imgs: char.getImgs(),
    weapons,
    holding,
    artis,
    materials: char.getMaterials(),
    elem: char.elem
  }, { e, scale: 1.4 })
}

async function renderCharMaterial ({ e, char }) {
  let data = char.getData()
  return await Common.render('wiki/character-material', {
    // saveId: `info-${char.id}`,
    data,
    attr: char.getAttrList(),
    detail: char.getDetail(),
    imgs: char.getImgs(),
    materials: char.getMaterials(),
    elem: char.elem
  }, { e, scale: 1.4 })
}

const getLineData = function (char) {
  let ret = []
  const attrMap = {
    atkPct: '大攻击',
    hpPct: '大生命',
    defPct: '大防御',
    cpct: '暴击',
    cdmg: '爆伤',
    recharge: '充能',
    mastery: '精通',
    heal: '治疗',
    dmg: char.elemName + '伤',
    phy: '物伤'
  }
  lodash.forEach({ hp: '基础生命', atk: '基础攻击', def: '基础防御' }, (label, key) => {
    ret.push({
      num: Format.comma(char.baseAttr[key], 1),
      label
    })
  })
  let ga = char.growAttr
  ret.push({
    num: ga.key === 'mastery' ? Format.comma(ga.value, 1) : ga.value,
    label: `成长·${attrMap[ga.key]}`
  })

  return ret
}

async function calendar (e) {
  let calData = await Calendar.get()
  let mode = 'calendar'
  if (/(日历列表|活动)$/.test(e.msg)) {
    mode = 'list'
  }

  return await Common.render('wiki/calendar', {
    ...calData,
    displayMode: mode
  }, { e, scale: 1.1 })
}
