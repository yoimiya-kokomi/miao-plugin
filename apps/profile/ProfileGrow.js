/*
* 角色养成计算
* 根据本地面板/角色数据中的等级、突破与天赋，计算升至目标等级与天赋所需的材料
* */
import lodash from 'lodash'
import { getTargetUid } from './ProfileCommon.js'
import { Common, Format } from '#miao'
import { Character, Material, Player } from '#miao.models'

// 角色经验：升至对应等级所需的累计经验（索引为等级）
const expTotal = (() => {
  let toNext = [
    1000, 1325, 1700, 2150, 2625, 3150, 3725, 4350, 5000, 5700,
    6450, 7225, 8050, 8925, 9825, 10750, 11725, 12725, 13775, 14875,
    16800, 18000, 19250, 20550, 21875, 23250, 24650, 26100, 27575, 29100,
    30650, 32250, 33875, 35550, 37250, 38975, 40750, 42575, 44425, 46300,
    50625, 52700, 54775, 56900, 59075, 61275, 63525, 65800, 68125, 70475,
    76500, 79050, 81650, 84275, 86950, 89650, 92400, 95175, 98000, 100875,
    108950, 112050, 115175, 118325, 121525, 124775, 128075, 131400, 134775, 138175,
    148700, 152375, 156075, 159825, 163600, 167425, 171300, 175225, 179175, 183175,
    216225, 243025, 273100, 306800, 344600, 386950, 434425, 487625, 547200
  ]
  let ret = [0, 0]
  lodash.forEach(toNext, (exp, idx) => {
    ret[idx + 2] = ret[idx + 1] + exp
  })
  return ret
})()

// 突破等级节点，及各突破阶段消耗（材料星级对应 material/data.json 中的 star）
const promoteLvs = [20, 40, 50, 60, 70, 80]
const promoteCost = [
  { gem: [2, 1], boss: 0, specialty: 3, normal: [1, 3], mora: 20000 },
  { gem: [3, 3], boss: 2, specialty: 10, normal: [1, 15], mora: 40000 },
  { gem: [3, 6], boss: 4, specialty: 20, normal: [2, 12], mora: 60000 },
  { gem: [4, 3], boss: 8, specialty: 30, normal: [2, 18], mora: 80000 },
  { gem: [4, 6], boss: 12, specialty: 45, normal: [3, 12], mora: 100000 },
  { gem: [5, 6], boss: 20, specialty: 60, normal: [3, 24], mora: 120000 }
]

// 各突破阶段可升至的天赋上限
const talentMax = [1, 1, 2, 4, 6, 8, 10]

// 单个天赋升至对应等级的消耗（索引为目标天赋等级）
const talentCost = {
  2: { talent: [2, 3], normal: [1, 6], mora: 12500 },
  3: { talent: [3, 2], normal: [2, 3], mora: 17500 },
  4: { talent: [3, 4], normal: [2, 4], mora: 25000 },
  5: { talent: [3, 6], normal: [2, 6], mora: 30000 },
  6: { talent: [3, 9], normal: [2, 9], mora: 37500 },
  7: { talent: [4, 4], normal: [3, 4], weekly: 1, mora: 120000 },
  8: { talent: [4, 6], normal: [3, 6], weekly: 1, mora: 260000 },
  9: { talent: [4, 12], normal: [3, 9], weekly: 2, mora: 450000 },
  10: { talent: [4, 16], normal: [3, 12], weekly: 2, crown: 1, mora: 700000 }
}

const talentKeys = { a: '普攻', e: '战技', q: '爆发' }
const maxLevel = 90
const witExp = 20000

const getPromote = (level) => promoteLvs.filter((lv) => level > lv).length

const ProfileGrow = {
  async render (e) {
    let msg = e.original_msg || e.msg || ''
    let uidRet = /(18|[1-9])[0-9]{8}/.exec(msg)
    if (uidRet) {
      e.uid = uidRet[0]
      msg = msg.replace(uidRet[0], '')
    }
    let ret = /^#(?:原神)?\s*(.+?)\s*(?:养成|培养)计算\s*([\d\s,，/]*)$/.exec(msg)
    if (!ret) {
      return false
    }
    let char = Character.get(ret[1].trim(), 'gs')
    if (!char || char.isSr) {
      return false
    }
    if (char.isCustom) {
      e.reply('自定义角色暂不支持养成计算')
      return true
    }
    if (char.isTraveler) {
      e.reply('旅行者暂不支持养成计算')
      return true
    }

    let target = ProfileGrow.parseTarget(ret[2])
    if (!target) {
      e.reply('格式：#刻晴养成计算 [目标等级] [普攻] [战技] [爆发]\n例如：#刻晴养成计算 90 9 9 9，等级最高90，天赋最高10')
      return true
    }

    let uid = await getTargetUid(e)
    if (!uid) {
      return true
    }
    let player = Player.create(e)
    let avatar = player.getAvatar(char.id)
    let hasData = !!(avatar && avatar.hasData)
    let talent = hasData ? avatar.originalTalent : {}
    let curr = {
      level: hasData ? avatar.level * 1 || 1 : 1,
      promote: hasData ? avatar.promote * 1 || 0 : 0,
      a: talent.a || 1,
      e: talent.e || 1,
      q: talent.q || 1
    }
    let data = ProfileGrow.calc(char, curr, target)
    if (!data) {
      e.reply(`暂无${char.name}的养成材料数据`)
      return true
    }

    return await Common.render('wiki/character-grow', {
      uid,
      hasData,
      ...data,
      role: char.getData('id,name,abbr,star,elem,face'),
      elem: char.elem
    }, { e, scale: 1.4 })
  },

  // 解析目标：[等级] [普攻] [战技] [爆发]，仅给出两个数字时第二个数字作为全部天赋目标
  parseTarget (str = '') {
    let nums = (str.match(/\d+/g) || []).map((n) => n * 1)
    let [level = maxLevel, a = 10, e, q] = nums
    if (nums.length === 2) {
      e = q = a
    }
    e = e ?? 10
    q = q ?? 10
    if (level < 1 || level > maxLevel) {
      return false
    }
    for (let t of [a, e, q]) {
      if (t < 1 || t > 10) {
        return false
      }
    }
    return { level, a, e, q }
  },

  calc (char, curr, target) {
    let mats = char.materials || {}
    let items = {}
    let mora = { promote: 0, talent: 0, exp: 0 }
    let missing = false

    // 获取对应星级的材料，无分级的材料直接返回自身
    let getMat = (name, star = 0) => {
      let mat = name && Material.get(name)
      if (!mat) {
        missing = true
        return false
      }
      if (star && mat.meta?.items?.[star]) {
        return Material.get(mat.meta.items[star]) || mat
      }
      return mat
    }
    let add = (name, star, num, sort) => {
      if (!num) {
        return
      }
      let mat = getMat(name, star)
      if (!mat) {
        return
      }
      if (!items[mat.name]) {
        items[mat.name] = {
          ...mat.getData('name,star,icon,type'),
          label: mat.name.replace(/^「(.+)」的(.+)$/, '$1·$2'),
          num: 0,
          sort: sort * 10 + (mat.star || 0)
        }
      }
      items[mat.name].num += num
    }

    let to = {
      level: Math.max(target.level, curr.level),
      a: Math.max(target.a, curr.a),
      e: Math.max(target.e, curr.e),
      q: Math.max(target.q, curr.q)
    }
    // 天赋目标超出当前突破上限时，需要额外突破
    let needTalent = Math.max(to.a, to.e, to.q)
    let talentPromote = talentMax.findIndex((max) => max >= needTalent)
    to.promote = Math.max(curr.promote, getPromote(to.level), talentPromote)

    // 角色突破
    for (let p = curr.promote; p < to.promote; p++) {
      let cost = promoteCost[p]
      add(mats.gem, cost.gem[0], cost.gem[1], 1)
      add(mats.boss, 0, cost.boss, 2)
      add(mats.specialty, 0, cost.specialty, 3)
      add(mats.normal, cost.normal[0], cost.normal[1], 4)
      mora.promote += cost.mora
    }

    // 天赋升级
    let crown = 0
    lodash.forEach(talentKeys, (title, key) => {
      for (let lv = curr[key] + 1; lv <= to[key]; lv++) {
        let cost = talentCost[lv]
        add(mats.talent, cost.talent[0], cost.talent[1], 5)
        add(mats.normal, cost.normal[0], cost.normal[1], 4)
        add(mats.weekly, 0, cost.weekly || 0, 6)
        crown += cost.crown || 0
        mora.talent += cost.mora
      }
    })

    if (missing) {
      return false
    }

    // 经验，1点经验消耗0.2摩拉
    let exp = expTotal[to.level] - expTotal[curr.level]
    mora.exp = Math.ceil(exp / 5)
    let moraTotal = mora.promote + mora.talent + mora.exp

    return {
      curr,
      to,
      items: lodash.sortBy(lodash.values(items), 'sort').map((ds) => ({ ...ds, num: Format.comma(ds.num) })),
      crown,
      exp: Format.comma(exp),
      wit: Math.ceil(exp / witExp),
      mora: lodash.mapValues(mora, (v) => Format.comma(v)),
      moraTotal: Format.comma(moraTotal),
      talentKeys,
      isDone: exp === 0 && moraTotal === 0 && crown === 0
    }
  }
}

export default ProfileGrow
