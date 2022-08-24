import { segment } from 'oicq'
import lodash from 'lodash'
import Calendar from './wiki/calendar.js'
import { Cfg, Common } from '../components/index.js'
import { Character } from '../models/index.js'

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

  let reg = /#?(.+)(命座|命之座|天赋|技能|资料|照片|写真|图片|图像)$/;
  let msg = e.msg
  let ret = reg.exec(msg)

  if (!ret || !ret[1] || !ret[2]) {
    return false
  }

  let mode = 'talent'
  if (/命/.test(ret[2])) {
    mode = 'cons'
  } else if (/图|画|写真|照片/.test(ret[2])) {
    mode = 'pic'
  }

  if ((mode === 'pic' && Common.isDisable(e, 'wiki.pic')) ||
    (mode !== 'pic' && Common.isDisable('wiki.wiki'))) {
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

  return await Common.render('wiki/character', {
    save_id: '天赋' + char.name,
    ...char,
    mode,
    line: getLineData(char),
    _char: `/meta/character/${char.name}/`
  }, { e, scale: 1 })
}

const getLineData = function (data) {
  let ret = []
  lodash.forEach(data.lvStat.detail['90'], (num, idx) => {
    ret.push({
      num,
      label: data.lvStat.stat[idx]
    })
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
