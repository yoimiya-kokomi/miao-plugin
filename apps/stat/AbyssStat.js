import HutaoApi from './HutaoApi.js'
import lodash from 'lodash'
import { Common } from '#miao'
import { Character } from '#miao.models'

export async function ConsStat (e) {
  let consData = await HutaoApi.getCons()
  let overview = await HutaoApi.getOverview()

  if (!consData) {
    e.reply('角色持有数据获取失败，请稍后重试~')
    return true
  }

  let msg = e.msg

  let mode = /持有/.test(msg) ? 'char' : 'cons'

  let conNum = -1
  if (mode === 'cons') {
    lodash.forEach([/0|零/, /1|一/, /2|二/, /3|三/, /4|四/, /5|五/, /6|六|满/], (reg, idx) => {
      if (reg.test(msg)) {
        conNum = idx
        return false
      }
    })
  }

  if (!consData && !consData.data) {
    return true
  }

  let data = consData.data

  let Lumine = lodash.filter(data, (ds) => ds.avatar === 10000007)[0] || {}
  let Aether = lodash.filter(data, (ds) => ds.avatar === 10000005)[0] || {}

  Lumine.holdingRate = (1 - Aether.holdingRate) || Lumine.holdingRate

  let ret = []

  lodash.forEach(data, (ds) => {
    let char = Character.get(ds.avatar)

    let data = {
      name: char.name || ds.avatar,
      abbr: char.abbr,
      star: char.star || 3,
      side: char.side,
      hold: ds.holdingRate
    }

    if (mode === 'char') {
      data.cons = lodash.map(ds.rate, (c) => {
        c.value = c.value * ds.holdingRate
        return c
      })
    } else {
      data.cons = ds.rate
    }
    data.cons = lodash.sortBy(data.cons, ['id'])

    ret.push(data)
  })

  if (conNum > -1) {
    ret = lodash.sortBy(ret, [`cons[${conNum}].value`])
    ret.reverse()
  } else {
    ret = lodash.sortBy(ret, ['hold'])
  }
  // 渲染图像
  return await Common.render('stat/character', {
    chars: ret,
    mode,
    conNum,
    totalCount: overview?.data?.totalPlayerCount || 0,
    lastUpdate: consData.lastUpdate,
    pct: function (num) {
      return (num * 100).toFixed(2)
    }
  }, { e, scale: 1.5 })
}

export async function AbyssPct (e) {
  let mode = /使用/.test(e.msg) ? 'use' : 'pct'
  let modeName
  let abyssData
  let modeMulti = 1

  if (mode === 'use') {
    modeName = '使用率'
    abyssData = await HutaoApi.getAbyssUse()
  } else {
    modeName = '出场率'
    abyssData = await HutaoApi.getAbyssPct()
    modeMulti = 8
  }
  let overview = await HutaoApi.getOverview()

  if (!abyssData) {
    e.reply(`深渊${modeName}数据获取失败，请稍后重试~`)
    return true
  }

  let ret = []
  let chooseFloor = -1
  let msg = e.msg

  const floorName = {
    12: '十二层',
    11: '十一层',
    10: '十层',
    9: '九层'
  }

  // 匹配深渊楼层信息
  lodash.forEach(floorName, (cn, num) => {
    let reg = new RegExp(`${cn}|${num}`)
    if (reg.test(msg)) {
      chooseFloor = num
      return false
    }
  })

  let data = abyssData.data
  data = lodash.sortBy(data, 'floor')
  data = data.reverse()

  lodash.forEach(data, (floorData) => {
    let avatars = []
    lodash.forEach(floorData.avatarUsage, (ds) => {
      let char = Character.get(ds.id)
      if (char) {
        avatars.push({
          name: char.name,
          star: char.star,
          value: ds.value * modeMulti,
          face: char.face
        })
      }
    })
    avatars = lodash.sortBy(avatars, 'value', ['asc'])
    avatars.reverse()
    if (chooseFloor === -1) {
      avatars = avatars.slice(0, 14)
    }

    ret.push({
      floor: floorData.floor,
      avatars
    })
  })

  return await Common.render('stat/abyss-pct', {
    abyss: ret,
    floorName,
    chooseFloor,
    mode,
    modeName,
    totalCount: overview?.data?.collectedPlayerCount || 0,
    lastUpdate: abyssData.lastUpdate
  }, { e, scale: 1.5 })
}
