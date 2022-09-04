import { segment } from 'oicq'
import lodash from 'lodash'
import Calendar from './wiki/calendar.js'
import { Format, Cfg, Common } from '../components/index.js'
import { Character, Weapon } from '../models/index.js'
import HutaoApi from './stat/HutaoApi.js'

// eslint-disable-next-line no-unused-vars
let action = {
  wiki: {
    keyword: '命座|天赋|技能|资料|照片|写真|图片|插画'
  }
}

export async function wiki (e) {
  if (!e.msg) {
    return false
  }

  let reg = /#?(.+)(命座|命之座|天赋|技能|资料|图鉴|照片|写真|图片|图像)$/
  let msg = e.msg
  let ret = reg.exec(msg)

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
  }

  if ((mode === 'pic' && Common.isDisable(e, 'wiki.pic')) ||
    (mode !== 'pic' && Common.isDisable(e, 'wiki.wiki'))) {
    return
  }

  let char = Character.get(ret[1])
  if (!char) {
    return false
  }

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
    e.reply('暂不支持自定义角色')
    return true
  }
  let lvs = []
  for (let i = 1; i <= 15; i++) {
    lvs.push('Lv' + i)
  }
  if (mode === 'wiki') {
    return await renderWiki({ e, char })
  }
  return await Common.render('wiki/character-talent', {
    saveId: `${mode}-${char.id}-${char.elem}`,
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
  let wu = (await HutaoApi.getWeaponUsage()).data || {}
  let weapons = []
  if (wu[char.id]) {
    lodash.forEach(wu[char.id], (ds) => {
      let weapon = Weapon.get(ds.name) || {}
      weapons.push({
        name: ds.name,
        star: weapon.star || 4,
        value: Format.percent(ds.value, 1)
      })
    })
  }
  return await Common.render('wiki/character-wiki', {
    saveId: `info-${char.id}`,
    data,
    attr: char.getAttrList(),
    detail: char.getDetail(),
    imgs: char.getImgs(),
    weapons,
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
    num: ga.value,
    label: `成长·${attrMap[ga.key]}`
  })

  return ret
}

export async function calendar (e) {
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
