import HutaoApi from './HutaoApi.js'
import lodash from 'lodash'
import { Common } from '#miao'
import { Character } from '#miao.models'

export async function ConsStat(e) {
  let consData = await HutaoApi.getCons()

  if (!consData || !consData.data) return e.reply("角色持有数据获取失败，请稍后重试~")

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

  let data = consData.data

  let Lumine = lodash.filter(data, (ds) => ds.avatar === 10000007)[0] || {}
  let Aether = lodash.filter(data, (ds) => ds.avatar === 10000005)[0] || {}

  Lumine.holdingRate = (1 - Aether.holdingRate) || Lumine.holdingRate

  let ret = []

  lodash.forEach(data, (ds) => {
    let char = Character.get(ds.avatar)
    if (!char) return

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
    totalCount: consData.totalCount || 0,
    lastUpdate: consData.lastUpdate,
    pct: function (num) {
      return (num * 100).toFixed(2)
    }
  }, { e, scale: 1.5 })
}

export async function AbyssPct(e) {
  let modeName = "使用率"
  
  let isHard = /(幽境|危战)/.test(e.msg)
  let abyssName = isHard ? "幽境危战" : "深渊"
  
  let abyssData
  if (isHard) {
    abyssData = await HutaoApi.getLelaerAbyssRank2()
  } else {
    abyssData = await HutaoApi.getYshelperAbyssRank()
  }

  if (!abyssData) return e.reply(`${abyssName}${modeName}数据获取失败，请稍后重试~`)

  let ret = []
  let chooseFloor = -1
  let msg = e.msg

  let floorName = {}
  if (isHard) {
    floorName = { 12: "5&6层" }
  } else {
    floorName = { 12: "十二层" }
  }

  // 匹配深渊楼层信息
  lodash.forEach(floorName, (cn, num) => {
    let reg = new RegExp(`${cn}|${num}`)
    if (reg.test(msg)) {
      chooseFloor = num
      return false
    }
  })

  let avatars = []
  if (abyssData.result && abyssData.result.length > 0) {
    lodash.forEach(abyssData.result, (groupList) => {
      lodash.forEach(groupList, (group) => {
        if (group.list) {
          lodash.forEach(group.list, (charData) => {
            let name = charData.name ? charData.name.trim() : ""
            let char = Character.get(name)
            if (char && charData.use_rate > 0) {
              avatars.push({
                name: char.name,
                star: char.star,
                value: charData.use_rate / 100,
                face: char.face
              })
            }
          })
        }
      })
    })
  }

  avatars = lodash.sortBy(avatars, "value").reverse()

  if (chooseFloor === -1 || chooseFloor === 12 || chooseFloor === "12") {
    ret.push({
      floor: 12,
      avatars
    })
  }

  return await Common.render("stat/abyss-pct", {
    abyss: ret,
    floorName,
    chooseFloor,
    mode: "use",
    modeName,
    abyssName,
    totalCount: abyssData.top_own || 0,
    lastUpdate: abyssData.last_update
  }, { e, scale: 1.5 })
}
