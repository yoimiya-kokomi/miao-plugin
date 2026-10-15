/*
* 养成计算
* 角色：根据本地面板/角色数据中的等级、突破与天赋，计算升至目标所需的材料、经验与摩拉
* 武器：计算从指定等级（默认1级）升至目标等级所需的突破材料、经验与摩拉
* */
import lodash from 'lodash'
import { Common, Data, Format } from '#miao'
import { Character, Material, Player, Weapon } from '#miao.models'

// 升至下一级所需经验（索引0为1级升2级）
const charExp = [
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

// 武器升至下一级所需经验，按武器星级
const weaponExp = {
  5: [
    600, 950, 1350, 1800, 2325, 2925, 3525, 4200, 4950, 5700,
    6525, 7400, 8300, 9225, 10200, 11250, 12300, 13425, 14600, 15750,
    17850, 19175, 20550, 21975, 23450, 24950, 26475, 28050, 29675, 31350,
    33050, 34800, 36575, 38400, 40250, 42150, 44100, 46100, 48125, 50150,
    54875, 57125, 59400, 61725, 64100, 66500, 68925, 71400, 73950, 76500,
    83075, 85850, 88650, 91550, 94425, 97400, 100350, 103400, 106475, 109575,
    118350, 121700, 125100, 128550, 132050, 135575, 139125, 142725, 146375, 150075,
    161525, 165500, 169500, 173550, 177650, 181800, 186000, 190250, 194525, 198875,
    234725, 263825, 296400, 332975, 373950, 419925, 471375, 529050, 593675
  ],
  4: [
    400, 625, 900, 1200, 1550, 1950, 2350, 2800, 3300, 3800,
    4350, 4925, 5525, 6150, 6800, 7500, 8200, 8950, 9725, 10500,
    11900, 12775, 13700, 14650, 15625, 16625, 17650, 18700, 19775, 20900,
    22025, 23200, 24375, 25600, 26825, 28100, 29400, 30725, 32075, 33425,
    36575, 38075, 39600, 41150, 42725, 44325, 45950, 47600, 49300, 51000,
    55375, 57225, 59100, 61025, 62950, 64925, 66900, 68925, 70975, 73050,
    78900, 81125, 83400, 85700, 88025, 90375, 92750, 95150, 97575, 100050,
    107675, 110325, 113000, 115700, 118425, 121200, 124000, 126825, 129675, 132575,
    156475, 175875, 197600, 221975, 249300, 279950, 314250, 352700, 395775
  ],
  3: [
    275, 425, 600, 800, 1025, 1275, 1550, 1850, 2175, 2500,
    2875, 3250, 3650, 4050, 4500, 4950, 5400, 5900, 6425, 6925,
    7850, 8425, 9050, 9675, 10325, 10975, 11650, 12350, 13050, 13800,
    14525, 15300, 16100, 16900, 17700, 18550, 19400, 20275, 21175, 22050,
    24150, 25125, 26125, 27150, 28200, 29250, 30325, 31425, 32550, 33650,
    36550, 37775, 39000, 40275, 41550, 42850, 44150, 45500, 46850, 48225,
    52075, 53550, 55050, 56550, 58100, 59650, 61225, 62800, 64400, 66025,
    71075, 72825, 74575, 76350, 78150, 80000, 81850, 83700, 85575, 87500,
    103275, 116075, 130425, 146500, 164550, 184775, 207400, 232775, 261200
  ],
  2: [
    175, 275, 400, 550, 700, 875, 1050, 1250, 1475, 1700,
    1950, 2225, 2475, 2775, 3050, 3375, 3700, 4025, 4375, 4725,
    5350, 5750, 6175, 6600, 7025, 7475, 7950, 8425, 8900, 9400,
    9900, 10450, 10975, 11525, 12075, 12650, 13225, 13825, 14425, 15050,
    16450, 17125, 17825, 18525, 19225, 19950, 20675, 21425, 22175, 22950,
    24925, 25750, 26600, 27450, 28325, 29225, 30100, 31025, 31950, 32875,
    35500, 36500, 37525, 38575, 39600, 40675, 41750, 42825, 43900
  ],
  1: [
    125, 200, 275, 350, 475, 575, 700, 850, 1000, 1150,
    1300, 1475, 1650, 1850, 2050, 2250, 2450, 2675, 2925, 3150,
    3575, 3825, 4100, 4400, 4700, 5000, 5300, 5600, 5925, 6275,
    6600, 6950, 7325, 7675, 8050, 8425, 8825, 9225, 9625, 10025,
    10975, 11425, 11875, 12350, 12825, 13300, 13775, 14275, 14800, 15300,
    16625, 17175, 17725, 18300, 18875, 19475, 20075, 20675, 21300, 21925,
    23675, 24350, 25025, 25700, 26400, 27125, 27825, 28550, 29275
  ]
}

// 突破等级节点
const promoteLvs = [20, 40, 50, 60, 70, 80]

// 角色各突破阶段消耗，[材料星级, 数量]（星级对应 material/data.json 中的 star）
const charPromote = [
  { gem: [2, 1], boss: 0, specialty: 3, normal: [1, 3], mora: 20000 },
  { gem: [3, 3], boss: 2, specialty: 10, normal: [1, 15], mora: 40000 },
  { gem: [3, 6], boss: 4, specialty: 20, normal: [2, 12], mora: 60000 },
  { gem: [4, 3], boss: 8, specialty: 30, normal: [2, 18], mora: 80000 },
  { gem: [4, 6], boss: 12, specialty: 45, normal: [3, 12], mora: 100000 },
  { gem: [5, 6], boss: 20, specialty: 60, normal: [3, 24], mora: 120000 }
]

// 武器各突破阶段的材料星级
const weaponPromoteStar = {
  weapon: [2, 3, 3, 4, 4, 5],
  monster: [2, 2, 3, 3, 4, 4],
  normal: [1, 1, 2, 2, 3, 3]
}
// 武器各突破阶段消耗，[武器材料, 精英材料, 普通材料, 摩拉]，按武器星级
const weaponPromote = {
  5: [[5, 5, 3, 10000], [5, 18, 12, 20000], [9, 9, 9, 30000], [5, 18, 14, 45000], [9, 14, 9, 55000], [6, 27, 18, 65000]],
  4: [[3, 3, 2, 5000], [3, 12, 8, 15000], [6, 6, 6, 20000], [3, 12, 9, 30000], [6, 9, 6, 35000], [4, 18, 12, 45000]],
  3: [[2, 2, 1, 5000], [2, 8, 5, 10000], [4, 4, 4, 15000], [2, 8, 6, 20000], [4, 6, 4, 25000], [3, 12, 8, 30000]],
  2: [[1, 1, 1, 5000], [1, 5, 4, 5000], [3, 3, 3, 10000], [1, 5, 4, 15000]],
  1: [[1, 1, 1, 0], [1, 4, 2, 5000], [2, 2, 2, 5000], [1, 4, 3, 10000]]
}

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
const charMaxLv = 90

// 非材料图鉴物品
const items = {
  mora: { label: '摩拉', star: 3, icon: 'wiki/imgs/grow/mora.webp' },
  charExp: { label: '大英雄的经验', star: 4, icon: 'wiki/imgs/grow/exp-char.webp', exp: 20000, mora: 5 },
  weaponExp: { label: '精锻用魔矿', star: 3, icon: 'wiki/imgs/grow/exp-weapon.webp', exp: 10000, mora: 10 },
  crown: { label: '智识之冕', star: 5, icon: 'wiki/imgs/grow/crown.webp' }
}

// 还需材料的排列顺序
const lackSort = {
  gem: 1, weapon: 1, boss: 2, monster: 2, specialty: 3, normal: 4, talent: 5, weekly: 6,
  other: 7, crown: 8, charExp: 9, weaponExp: 9, mora: 10
}

const helpMsg = [
  '养成计算格式：',
  '#养成计算 刻晴：等级90、天赋10/10/10',
  '#养成计算 刻晴 天赋 10 9 10：仅计算天赋',
  '#养成计算 刻晴 等级89 天赋 10 9 10',
  '#养成计算 雾切 80：雾切从1级升至80级（未突破）',
  '#养成计算 雾切 50-80+：从50级升至80级并突破'
].join('\n')

// 获取同系列材料中指定星级的材料（部分低星武器的材料记录为低阶材料，需先找到所属系列）
let matSeries = null
const getTierMat = (name, star) => {
  if (!matSeries) {
    matSeries = {}
    lodash.forEach(Data.readJSON('resources/meta-gs/material/data.json', 'miao'), (ds) => {
      lodash.forEach(ds.items, (item) => {
        matSeries[item.name] = ds.name
      })
    })
  }
  let mat = name && Material.get(matSeries[name] || name)
  if (mat && star && mat.meta?.items?.[star]) {
    return Material.get(mat.meta.items[star]) || mat
  }
  return mat
}

const getPromote = (level) => promoteLvs.filter((lv) => level > lv).length
const promoteMinLv = (promote) => promote > 0 ? promoteLvs[promote - 1] : 1
const sumExp = (table, from, to) => lodash.sum(table.slice(from - 1, to - 1))

// 计算器接口只区分等级，已在突破节点完成突破的按下一级传入
const apiLv = ({ level, promote }) => Math.min(promote > getPromote(level) ? level + 1 : level, charMaxLv)

// 原神UID对应服务器，与Yunzai一致：按去掉末8位后的前缀区分（9位18开头为国服官服，10位18开头为国际服亚服）
const getGsRegion = (uid) => ({
  5: 'cn_qd01', 6: 'os_usa', 7: 'os_euro', 8: 'os_asia', 18: 'os_asia', 9: 'os_cht'
})[String(uid).slice(0, -8)] || 'cn_gf01'

// 解析等级文本，80 为80级未突破，80+ 为80级已突破
const parseLv = (lv, plus) => {
  lv = lv * 1
  return { level: lv, promote: getPromote(lv) + (plus && promoteLvs.includes(lv) ? 1 : 0) }
}

const ProfileGrow = {
  async render (e) {
    let msg = e.original_msg || e.msg || ''
    let uidRet = /(18|[1-9])[0-9]{8}/.exec(msg)
    if (uidRet) {
      e.uid = uidRet[0]
      msg = msg.replace(uidRet[0], '')
    }
    let opt = ProfileGrow.parseMsg(msg)
    if (!opt) {
      e.reply(helpMsg)
      return true
    }
    opt.uid = uidRet?.[0] || ''
    let char = Character.get(opt.name, 'gs')
    if (char && !char.isSr) {
      return await ProfileGrow.renderChar(e, char, opt)
    }
    let weapon = Weapon.get(opt.name, 'gs')
    if (weapon) {
      return await ProfileGrow.renderWeapon(e, weapon, opt)
    }
    return false
  },

  // 解析：名称 [等级[起始-]目标] [天赋 普攻 战技 爆发] [数字...]
  parseMsg (msg) {
    let body = msg.replace(/^#(原神)?(养成|培养)计算/, '').trim()
    let nameRet = /^(.+?)\s*(?=等级|天赋|\d|$)/.exec(body)
    if (!nameRet) {
      return false
    }
    let opt = { name: nameRet[1].trim(), from: null, level: null, talent: null, nums: [] }
    let rest = body.slice(nameRet[0].length)
    let lvReg = /(等级)?\s*(?:(\d+)(\+?)\s*[-~到至]\s*)?(\d+)(\+?)/
    let lvRet = /等级/.test(rest) ? lvReg.exec(rest.slice(rest.indexOf('等级'))) : /^\s*\d+\+?\s*[-~到至]/.test(rest) ? lvReg.exec(rest) : null
    if (lvRet) {
      if (lvRet[2]) {
        opt.from = parseLv(lvRet[2], lvRet[3])
      }
      opt.level = parseLv(lvRet[4], lvRet[5])
      rest = rest.replace(lvRet[0], ' ')
    }
    let talentRet = /天赋\s*((?:\d+[\s,，/]*)*)/.exec(rest)
    if (talentRet) {
      let nums = (talentRet[1].match(/\d+/g) || []).map((n) => n * 1)
      if (nums.length === 0 || nums.length > 3) {
        return false
      }
      opt.talent = nums.length === 1 ? { a: nums[0], e: nums[0], q: nums[0] } : { a: nums[0], e: nums[1], q: nums[2] }
      rest = rest.replace(talentRet[0], ' ')
    }
    let nums = rest.match(/\d+\+?/g) || []
    rest = rest.replace(/\d+\+?/g, '')
    if (rest.replace(/[\s,，/]/g, '')) {
      return false
    }
    opt.nums = nums.map((n) => ({ num: parseInt(n), plus: /\+/.test(n) }))
    return opt
  },

  async renderChar (e, char, opt) {
    if (char.isCustom) {
      e.reply('自定义角色暂不支持养成计算')
      return true
    }
    if (char.isTraveler) {
      e.reply('旅行者暂不支持养成计算')
      return true
    }
    // 兼容不带关键词的写法：#养成计算 刻晴 90 10 10 10
    let { nums } = opt
    if (!opt.level && nums.length > 0) {
      opt.level = parseLv(nums[0].num, nums[0].plus)
      nums = nums.slice(1)
    }
    if (!opt.talent && nums.length > 0) {
      let [a, e, q] = nums.map((n) => n.num)
      opt.talent = { a, e: e ?? a, q: q ?? e ?? a }
      nums = nums.slice(3)
    }
    if (nums.length > 0 || !ProfileGrow.checkChar(opt)) {
      e.reply(helpMsg + '\n角色等级最高90，天赋最高10')
      return true
    }
    e.reply(`正在计算${char.name}的养成材料，请稍候...`)

    let zero = { level: 1, promote: 0, a: 1, e: 1, q: 1 }
    let curr = zero
    let uid = ''
    let notice = []
    if (opt.from) {
      curr = { ...zero, level: opt.from.level, promote: opt.from.promote }
      notice.push('已指定起始等级，不读取本地角色数据，天赋从1级开始计算')
    } else {
      // 优先使用本地角色数据；无数据或本地练度已超过目标时，按1级、天赋1/1/1计算
      let avatar = await ProfileGrow.getLocalAvatar(e, char)
      let local = avatar && {
        level: avatar.level * 1 || 1,
        promote: avatar.promote * 1 || 0,
        a: avatar.originalTalent?.a || 1,
        e: avatar.originalTalent?.e || 1,
        q: avatar.originalTalent?.q || 1
      }
      if (!local) {
        notice.push(`未找到本地${char.name}数据，按1级、天赋1/1/1计算，可先【#更新面板】`)
      } else if (ProfileGrow.isOverTarget(local, opt)) {
        notice.push(`本地${char.name}练度已超过目标，按1级、天赋1/1/1计算`)
      } else {
        curr = local
        uid = e.uid
      }
    }
    let data = ProfileGrow.calcChar(char, curr, opt)
    if (!data) {
      e.reply(`暂无${char.name}的养成材料数据`)
      return true
    }
    let lack = await ProfileGrow.getLack(e, opt, async (api) => {
      let item = {
        avatar_id: char.id * 1,
        avatar_level_current: apiLv(data.curr),
        avatar_level_target: apiLv(data.to)
      }
      let keys = lodash.keys(talentKeys).filter((key) => data.to[key] > data.curr[key])
      if (keys.length > 0) {
        let skills = await api.getData('avatarSkill', { avatar_id: char.id })
        let list = (skills?.data?.list || []).filter((ds) => ds.max_level !== 1)
        if (skills?.retcode !== 0 || list.length < 3) {
          return false
        }
        item.skill_list = keys.map((key) => {
          let ds = list[lodash.keys(talentKeys).indexOf(key)]
          return { id: ds.group_id * 1, level_current: data.curr[key], level_target: data.to[key] }
        })
      }
      return item
    })
    if (lack) {
      notice.unshift(lack.notice)
    }
    // 计算的是CK账号内的角色时，摩拉合计使用扣除背包后的数量
    if (uid && lack?.data && String(lack.data.uid) === String(uid)) {
      data.moraTotal = lack.data.mora
      data.moraLack = true
    }
    return await ProfileGrow.renderImg(e, {
      lack: lack?.data,
      ...data,
      uid,
      notice,
      title: char.name,
      star: char.star,
      img: char.face,
      elem: char.elem
    })
  },

  // 获取本地角色数据，未绑定UID时不提示绑定
  async getLocalAvatar (e, char) {
    let uid = e.uid
    if (!uid) {
      try {
        uid = e.runtime?.getUid ? await e.runtime.getUid() : e.runtime?.uid
      } catch (err) {
        uid = ''
      }
    }
    if (!/^(18|[1-9])[0-9]{8}$/.test(String(uid || ''))) {
      return false
    }
    e.uid = uid
    let avatar = Player.create(e).getAvatar(char.id)
    return avatar && avatar.hasData ? avatar : false
  },

  // 本地练度是否已超过指令中的目标
  isOverTarget (local, opt) {
    let isAll = !opt.level && !opt.talent
    let level = opt.level || (isAll ? { level: charMaxLv, promote: 6 } : null)
    let talent = opt.talent || (isAll ? { a: 10, e: 10, q: 10 } : {})
    if (level && (local.level > level.level || (local.level === level.level && local.promote > level.promote))) {
      return true
    }
    return lodash.some(talentKeys, (title, key) => talent[key] && local[key] > talent[key])
  },

  async renderWeapon (e, weapon, opt) {
    let maxLv = weapon.maxLv
    let level = opt.level || (opt.nums[0] && parseLv(opt.nums[0].num, opt.nums[0].plus)) || { level: maxLv, promote: weapon.maxPromote }
    let from = opt.from || { level: 1, promote: 0 }
    if (opt.talent || opt.nums.length > (opt.level ? 0 : 1) || level.level > maxLv || from.level > maxLv ||
      level.promote > weapon.maxPromote || from.promote > weapon.maxPromote) {
      e.reply(helpMsg + `\n${weapon.name}最高${maxLv}级`)
      return true
    }
    e.reply(`正在计算${weapon.name}的养成材料，请稍候...`)
    let data = ProfileGrow.calcWeapon(weapon, from, level)
    if (!data) {
      e.reply(`暂无${weapon.name}的养成材料数据`)
      return true
    }
    let notice = []
    if (!opt.from) {
      notice.push(`默认从1级开始计算，可指定起始等级，如 #养成计算 ${weapon.abbr || weapon.name} 50-80`)
    }
    let lack = await ProfileGrow.getLack(e, opt, async () => ({
      weapon: { id: weapon.id * 1, level_current: apiLv(data.curr), level_target: apiLv(data.to) }
    }))
    if (lack) {
      notice.unshift(lack.notice)
    }
    return await ProfileGrow.renderImg(e, {
      lack: lack?.data,
      ...data,
      notice,
      title: weapon.name,
      star: weapon.star,
      img: weapon.icon,
      isWeapon: true
    })
  },

  /**
   * 已绑定本人CK时，调用米游社养成计算器获取扣除背包（含可合成材料）后仍缺少的材料
   * 未绑定CK、查询他人UID或接口异常时返回false，仅展示本地计算结果
   * @param getItem 生成 batch_compute 的计算项
   */
  async getLack (e, opt, getItem) {
    let { runtime } = e
    if (!runtime?.getMysInfo || !runtime?.createMysApi) {
      return false
    }
    let uid = e.uid
    let failed = { notice: '米游社计算器请求失败，未扣除背包材料' }
    try {
      // 未绑定CK时不提示绑定；未安装原神插件（genshin）时 getMysInfo 不可用，仅使用本地计算
      e.noTips = true
      let mysInfo = await runtime.getMysInfo('cookie').catch(() => false)
      let { ck, uid: ckUid } = mysInfo?.ckInfo || {}
      // 只使用本人CK，且不为指令中指定的其他UID扣除背包
      if (!mysInfo?.uid || !ck || String(ckUid) !== String(mysInfo.uid) || (opt.uid && opt.uid !== String(mysInfo.uid))) {
        return false
      }
      // 国际服计算器接口返回格式不同，暂不支持
      let region = getGsRegion(mysInfo.uid)
      if (region.startsWith('os')) {
        return { notice: '国际服暂不支持扣除背包材料' }
      }
      let api = runtime.createMysApi(mysInfo.uid, ck, { log: false })
      let item = await getItem(api)
      if (!item) {
        return failed
      }
      // 需同时传入uid与region，接口才会返回该账号的背包数据（has_user_info）
      let ret = await api.getData('compute', { body: { items: [item], uid: String(mysInfo.uid), region } })
      let consume = ret?.data?.overall_consume
      if (ret?.retcode !== 0 || !lodash.isArray(consume)) {
        logger.mark(`[miao-plugin] 养成计算器请求失败：${ret?.retcode} ${ret?.message || ''}`)
        return failed
      }
      if (!ret.data.has_user_info) {
        return { notice: '米游社计算器未返回背包数据，未扣除背包材料' }
      }
      // 与本地计算保持一致的顺序：材料按类型、星级排列，其后为智识之冕、经验、摩拉
      let list = consume.filter((ds) => ds.lack_num > 0).map((ds) => {
        let key = lodash.findKey(items, (item) => item.label === ds.name)
        let local = items[key]
        let mat = !local && Material.get(ds.name)
        let star = mat?.star || local?.star || ds.level || 1
        return {
          label: ds.name.replace(/^「(.+)」的(.+)$/, '$1·$2'),
          star,
          icon: mat?.icon || local?.icon || ds.icon,
          num: Format.comma(ds.lack_num),
          sort: (lackSort[key] || lackSort[mat?.type] || lackSort.other) * 10 + (mat ? star : 0)
        }
      })
      list = lodash.sortBy(list, 'sort')
      return {
        notice: `已通过米游社计算器扣除UID:${mysInfo.uid}背包内材料（含可合成材料），背包数据可能存在延迟`,
        data: {
          uid: mysInfo.uid,
          items: list,
          mora: Format.comma(lodash.find(consume, (ds) => ds.name === items.mora.label)?.lack_num || 0)
        }
      }
    } catch (err) {
      logger.error('[miao-plugin] 养成计算器请求异常', err)
      return failed
    } finally {
      e.uid = uid
    }
  },

  async renderImg (e, data) {
    return await Common.render('wiki/character-grow', data, { e, scale: 1.4 })
  },

  checkChar (opt) {
    for (let lv of [opt.from, opt.level]) {
      if (lv && (lv.level < 1 || lv.level > charMaxLv || lv.promote > 6)) {
        return false
      }
    }
    return lodash.every(opt.talent || {}, (t) => t >= 1 && t <= 10)
  },

  // 材料汇总
  createGroup (title) {
    let list = {}
    let missing = false
    let mora = 0
    let add = (name, star, num, sort) => {
      if (!num) {
        return
      }
      let mat = getTierMat(name, star)
      if (!mat) {
        missing = true
        return
      }
      if (!list[mat.name]) {
        list[mat.name] = {
          ...mat.getData('star,icon'),
          label: mat.name.replace(/^「(.+)」的(.+)$/, '$1·$2'),
          num: 0,
          sort: sort * 10 + (mat.star || 0)
        }
      }
      list[mat.name].num += num
    }
    let addItem = (key, num, sort) => {
      if (!num) {
        return
      }
      list[key] = list[key] || { ...items[key], num: 0, sort: sort * 10 }
      list[key].num += num
    }
    return {
      add,
      addItem,
      addMora (num) {
        mora += num
      },
      get missing () {
        return missing
      },
      get mora () {
        return mora
      },
      getData (desc = '') {
        let ret = lodash.sortBy(lodash.values(list), 'sort')
        if (mora) {
          ret.push({ ...items.mora, num: mora })
        }
        return {
          title,
          desc,
          items: ret.map((ds) => ({ ...ds, num: Format.comma(ds.num) }))
        }
      }
    }
  },

  calcChar (char, curr, opt) {
    let mats = char.materials || {}
    let isAll = !opt.level && !opt.talent
    let target = {
      level: opt.level || (isAll ? { level: charMaxLv, promote: 6 } : { level: curr.level, promote: curr.promote }),
      talent: opt.talent || (isAll ? { a: 10, e: 10, q: 10 } : {})
    }
    let to = {}
    lodash.forEach(talentKeys, (title, key) => {
      to[key] = Math.max(curr[key], target.talent[key] || 0)
    })
    // 天赋目标超出突破上限时，需要额外突破（及对应的等级）
    let talentPromote = talentMax.findIndex((max) => max >= Math.max(to.a, to.e, to.q))
    to.promote = Math.max(curr.promote, target.level.promote, talentPromote)
    to.level = Math.max(curr.level, target.level.level, promoteMinLv(to.promote))
    to.promote = Math.max(to.promote, getPromote(to.level))
    let promoteByTalent = to.promote > Math.max(curr.promote, target.level.promote, getPromote(target.level.level))

    let groups = []

    // 等级提升
    let lvGroup = ProfileGrow.createGroup('等级提升')
    for (let p = curr.promote; p < to.promote; p++) {
      let cost = charPromote[p]
      lvGroup.add(mats.gem, cost.gem[0], cost.gem[1], 1)
      lvGroup.add(mats.boss, 0, cost.boss, 2)
      lvGroup.add(mats.specialty, 0, cost.specialty, 3)
      lvGroup.add(mats.normal, cost.normal[0], cost.normal[1], 4)
      lvGroup.addMora(cost.mora)
    }
    let exp = sumExp(charExp, curr.level, to.level)
    lvGroup.addItem('charExp', Math.ceil(exp / items.charExp.exp), 8)
    lvGroup.addMora(Math.ceil(exp / items.charExp.mora))
    if (opt.level || isAll || to.promote > curr.promote || to.level > curr.level) {
      let desc = [`Lv.${curr.level} → Lv.${to.level}`, `需经验 ${Format.comma(exp)}`]
      if (promoteByTalent) {
        desc.push(`天赋${Math.max(to.a, to.e, to.q)}级需突破至${to.promote}阶`)
      }
      groups.push(lvGroup.getData(desc.join('，')))
    }

    // 天赋升级
    let tGroup = ProfileGrow.createGroup('天赋升级')
    lodash.forEach(talentKeys, (title, key) => {
      for (let lv = curr[key] + 1; lv <= to[key]; lv++) {
        let cost = talentCost[lv]
        tGroup.add(mats.talent, cost.talent[0], cost.talent[1], 5)
        tGroup.add(mats.normal, cost.normal[0], cost.normal[1], 4)
        tGroup.add(mats.weekly, 0, cost.weekly || 0, 6)
        tGroup.addItem('crown', cost.crown || 0, 7)
        tGroup.addMora(cost.mora)
      }
    })
    if (opt.talent || isAll) {
      groups.push(tGroup.getData(lodash.map(talentKeys, (title, key) => `${title} ${curr[key]} → ${to[key]}`).join('，')))
    }

    if (lvGroup.missing || tGroup.missing) {
      return false
    }
    let rows = [
      { title: '等级', from: `Lv.${curr.level}`, to: `Lv.${to.level}` },
      { title: '突破', from: curr.promote, to: to.promote },
      ...lodash.map(talentKeys, (title, key) => ({ title, from: curr[key], to: to[key] }))
    ]
    return {
      curr,
      to,
      rows,
      groups,
      moraTotal: Format.comma(lvGroup.mora + tGroup.mora)
    }
  },

  calcWeapon (weapon, curr, target) {
    let mats = weapon.materials || {}
    let star = weapon.star
    let to = {
      promote: Math.max(curr.promote, target.promote),
      level: Math.max(curr.level, target.level)
    }
    to.promote = Math.max(to.promote, getPromote(to.level))
    let group = ProfileGrow.createGroup('突破与升级')
    for (let p = curr.promote; p < to.promote; p++) {
      let [wNum, mNum, nNum, mora] = weaponPromote[star][p]
      group.add(mats.weapon, weaponPromoteStar.weapon[p], wNum, 1)
      group.add(mats.monster, weaponPromoteStar.monster[p], mNum, 2)
      group.add(mats.normal, weaponPromoteStar.normal[p], nNum, 3)
      group.addMora(mora)
    }
    let exp = sumExp(weaponExp[star], curr.level, to.level)
    group.addItem('weaponExp', Math.ceil(exp / items.weaponExp.exp), 8)
    group.addMora(Math.ceil(exp / items.weaponExp.mora))
    if (group.missing) {
      return false
    }
    return {
      curr,
      to,
      rows: [
        { title: '等级', from: `Lv.${curr.level}`, to: `Lv.${to.level}` },
        { title: '突破', from: curr.promote, to: to.promote }
      ],
      groups: [group.getData(`Lv.${curr.level} → Lv.${to.level}，需经验 ${Format.comma(exp)}`)],
      moraTotal: Format.comma(group.mora)
    }
  }
}

export default ProfileGrow
