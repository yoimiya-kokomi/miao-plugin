/**
 * 最高分面板搭配搜索
 * 指令：#我的胡桃最高分面板 魔女2+追忆2 火伤杯 换护摩之杖 90级 精5 +15%暴击 补+10%大攻击
 * 路由 → ProfileDetail.detail() → profileMaxScoreBuild()
 */
import lodash from 'lodash'
import { Common, Format } from '#miao'
import { Character, Player, Artifact, ArtifactSet, MysApi, Weapon } from '#miao.models'
import ArtisMarkCfg from '../../models/artis/ArtisMarkCfg.js'
import ArtisMark from '../../models/artis/ArtisMark.js'
import ProfileChange from './ProfileChange.js'

/** 位置名（GS / SR） */
const POS_NAMES = { gs: ['花', '羽', '沙', '杯', '头'], sr: ['头', '手', '衣', '鞋', '球', '绳'] }

/** 位置名 → 索引 */
const POS_NAME_MAP = {
  gs: { '花': 1, '生之花': 1, '羽': 2, '死之羽': 2, '毛': 2, '沙': 3, '时之沙': 3, '杯': 4, '空之杯': 4, '头': 5, '理之冠': 5, '冠': 5, '帽子': 5, '帽': 5 },
  sr: { '头': 1, '帽子': 1, '头部': 1, '手': 2, '手套': 2, '手部': 2, '衣': 3, '衣服': 3, '甲': 3, '躯干': 3, '鞋': 4, '靴': 4, '鞋子': 4, '靴子': 4, '脚': 4, '脚部': 4, '球': 5, '位面球': 5, '绳': 6, '线': 6, '链接绳': 6, '连接绳': 6 }
}

/**
 * 解析套装约束字符串
 * "魔女2+追忆2" → [{ set, abbr, count }]
 */
function parseSetConstraint (str, game) {
  str = (str || '').trim()
  if (!str) return []
  return str.split('+').map(part => {
    let m = part.match(/^(.+?)(\d+)$/)
    if (!m) return null
    let count = Number(m[2])
    if (count !== 2 && count !== 4) return null
    let artiSet = ArtifactSet.get(m[1].trim(), game)
    if (!artiSet) return null
    return { set: artiSet.meta.name, abbr: artiSet.meta.abbr || m[1], count }
  }).filter(Boolean)
}

/** 检查套装计数是否满足约束 */
function satisfiesConstraint (setCounts, constraints) {
  for (let c of constraints) {
    if ((setCounts[c.set] || 0) < c.count) return false
  }
  return true
}

/** 中文属性名 → 圣遗物原始 key，仅用于主词条过滤 */
const MAIN_CN_TO_KEY = {
  '冰伤': 'cryo', '冰元素': 'cryo', '冰元素伤害': 'cryo',
  '火伤': 'pyro', '火元素': 'pyro', '火元素伤害': 'pyro',
  '水伤': 'hydro', '水元素': 'hydro', '水元素伤害': 'hydro',
  '雷伤': 'electro', '雷元素': 'electro', '雷元素伤害': 'electro',
  '风伤': 'anemo', '风元素': 'anemo', '风元素伤害': 'anemo',
  '岩伤': 'geo', '岩元素': 'geo', '岩元素伤害': 'geo',
  '草伤': 'dendro', '草元素': 'dendro', '草元素伤害': 'dendro',
  '物理': 'phy', '物理伤害': 'phy', '物伤': 'phy',
  '暴击': 'cpct', '暴击率': 'cpct', '爆伤': 'cdmg', '暴伤': 'cdmg', '暴击伤害': 'cdmg',
  '攻击': 'atk', '攻击力': 'atk', '大攻击': 'atk',
  '生命': 'hp', '生命值': 'hp', '大生命': 'hp',
  '防御': 'def', '防御力': 'def', '大防御': 'def',
  '充能': 'recharge', '充能效率': 'recharge', '元素充能': 'recharge', '元素充能效率': 'recharge',
  '精通': 'mastery', '元素精通': 'mastery',
  '治疗': 'heal', '治疗加成': 'heal',
}
function requireAttrKey (cn) {
  return MAIN_CN_TO_KEY[cn] || null
}

/**
 * 解析主词条指定 token
 * "冰伤杯" → { pos:4, rawKey:'cryo' }
 */
function parseMainStat (token, game) {
  let posMap = POS_NAME_MAP[game]
  if (!posMap) return null
  let matched = null; let maxLen = 0
  for (let suffix in posMap) {
    if (token.endsWith(suffix) && suffix.length > maxLen) {
      matched = suffix; maxLen = suffix.length
    }
  }
  if (!matched) return null
  let cnMain = token.slice(0, -matched.length)
  let meta = requireAttrKey(cnMain)
  if (!meta) return null
  return { pos: posMap[matched], rawKey: meta }
}

/**
 * 判断 token 是否为武器相关片段（等级/精炼/已知武器名）
 * 用于将连续的武器片段合并为一个 matchMsg 片段
 */
function isWepLike (token, game, charWeaponType) {
  if (/^\d{1,2}级$/.test(token) || /^等级\d{1,2}$/.test(token)) return true
  if (/^精(?:炼|影)?[1-5一二三四五满]$/.test(token)) return true
  if (/^[1-5一二三四五满]精(?:炼|影)?$/.test(token)) return true
  if (Weapon.get(token, game, charWeaponType)) return true
  if (Weapon.get(token, game)) return true
  return false
}

/**
 * 将换补令牌列表拼接为 matchMsg 可解析的伪指令
 * "#胡桃" + restTokens → "#胡桃换90级精5护摩之杖换+15暴击补+10%大攻击"
 * matchMsg 武器正则要求：等级/精炼在武器名之前，因此合并时做重排
 */
function buildMockCmd (charName, restTokens, game, charWeaponType) {
  let mockFragments = []
  let pendingWeapon = []

  function flushWeapon () {
    if (!pendingWeapon.length) return
    // 重排：等级/精炼等修饰词在前，武器名在后
    let specs = []
    let names = []
    for (let t of pendingWeapon) {
      if (/^(?:\d{1,2}级|等级\d{1,2}|精(?:炼|影)?[1-5一二三四五满]|[1-5一二三四五满]精(?:炼|影)?|叠影[1-5])$/.test(t)) {
        specs.push(t)
      } else {
        names.push(t)
      }
    }
    mockFragments.push('换' + [...specs, ...names].join(''))
    pendingWeapon = []
  }

  for (let token of restTokens) {
    if (!token) continue
    let clean = token.replace(/^[换]/, '')

    if (token.startsWith('补')) {
      flushWeapon()
      mockFragments.push(token)
    } else if (isWepLike(clean, game, charWeaponType)) {
      pendingWeapon.push(clean)
    } else {
      flushWeapon()
      mockFragments.push('换' + clean)
    }
  }
  flushWeapon()

  if (!mockFragments.length) return ''
  return '#' + charName + mockFragments.join('')
}

/**
 * 解析 matchMsg 锁定的圣遗物位置，从来源面板获取原始数据
 * @returns {Object|null} arti 原始数据（含 main/attrs/idx/set 等）
 */
function resolveLockedArti (lockCfg, uid, game) {
  if (!lockCfg) return null
  let pos = lockCfg.type ? parseInt(lockCfg.type.replace('arti', '')) : null
  if (!pos) return null
  let srcUid = lockCfg.uid || uid
  let srcCharId = lockCfg.char
  let srcPlayer = Player.create(srcUid, game)
  let srcProfile = srcPlayer.getProfile(srcCharId)
  if (!srcProfile?.artis || !srcProfile.artis[pos]) return null

  let arti = srcProfile.artis[pos]
  if (!arti || !arti.main || !arti.attrs) return null
  return { arti, pos, set: arti.set || '', srcProfile }
}

/**
 * 将来源圣遗物原始数据构建为 artsByPos 条目（供搜索/评分用）
 */
function buildArtiEntry (arti, pos, srcProfile, game) {
  let rawMain = arti.main
  let rawAttrs = arti.attrs
  let mainDisplay = ArtisMark.formatArti(rawMain, null, true, game)
  let attrsDisplay = ArtisMark.formatArtiAttrs(rawAttrs, null, game)
  let artifactInfo = Artifact.get(arti, game)

  return {
    name: artifactInfo?.name || (arti.name || ''),
    abbr: artifactInfo?.abbr || '',
    img: artifactInfo?.img || '',
    set: artifactInfo?.setName || arti.set || '',
    level: arti.level || 0,
    main: mainDisplay,
    attrs: attrsDisplay,
    avatar: srcProfile?.name || '',
    charId: srcProfile?.charId || '',
    side: srcProfile?.char?.side || '',
    uid: srcProfile?.uid || '',
    idx: pos,
    elem: srcProfile?.char?.elem || '',
    charWeight: {},
    star: arti.star || 5,
    _raw: {
      main: rawMain, attrs: rawAttrs, idx: pos,
      set: artifactInfo?.setName || arti.set || '',
      mainId: arti.mainId, attrIds: arti.attrIds,
      name: arti.name, artiId: arti.id
    }
  }
}

/**
 * 将搜索/锁定圣遗物构建为 getProfile change 格式
 */
function buildArtiChange (arti, isSr) {
  let raw = arti._raw
  let data = { mode: 'ocr', level: arti.level, mainId: raw.mainId, attrIds: raw.attrIds }
  if (isSr) {
    data.id = raw.artiId || arti.name
  } else {
    data.name = raw.name || arti.name
    data.star = arti.star
  }
  return data
}

/**
 * 统一解析指令参数
 * 剥离 max-score 独有令牌（套装约束/主词条/伤害序号），剩余的留给 matchMsg
 * "魔女2+追忆2 火伤杯 换护摩之杖 90级 精5 +15暴击 补+10%大攻击"
 *   → { setConstraints:[], mainStats:[], dmgIdx:0, restTokens:[] }
 */
function parseMaxParams (paramStr, game) {
  let result = { setConstraints: [], mainStats: [], dmgIdx: 0, restTokens: [] }
  let tokens = paramStr.trim().split(/\s+/)

  for (let token of tokens) {
    if (!token) continue

    // 套装约束
    let sc = parseSetConstraint(token, game)
    if (sc.length) { result.setConstraints.push(...sc); continue }

    // 主词条
    let ms = parseMainStat(token, game)
    if (ms) { result.mainStats.push(ms); continue }

    // 最强面板伤害序号（未来，传入方式待定）
    let dmgRet = /^伤害(\d*)$/.exec(token)
    if (dmgRet) { result.dmgIdx = dmgRet[1] ? Number(dmgRet[1]) : 0; continue }

    // 其余令牌 → 交 matchMsg 统一解析换补
    result.restTokens.push(token)
  }
  return result
}

/**
 * 用目标角色的评分规则重新计算圣遗物评分
 */
function recalcArtisMark (arti, charCfg, game, elem) {
  let raw = arti._raw
  let mark = ArtisMark.getMark({
    charCfg,
    idx: raw.idx,
    arti: { main: raw.main, attrs: raw.attrs },
    elem,
    game,
    id: charCfg.id
  })
  return Math.round(mark * 10) / 10
}

/**
 * 回溯搜索最优圣遗物组合（不被改动）
 * @param {Function} scoreFn - 评分函数 (arti) => number
 *   最高分面板：recalcArtisMark(arti, charCfg, game, elem)
 *   最强面板：calcArtisDmg(arti, ...)   // 未来预留
 * @returns {Array|null} 最优组合 [pos1, ..., posN]
 */
function findBestCombination (artsByPos, constraints, scoreFn, posCount) {
  // 预计算每件评分并排序
  for (let pos = 1; pos <= posCount; pos++) {
    for (let arti of artsByPos[pos]) {
      arti.score = scoreFn(arti)
    }
    artsByPos[pos].sort((a, b) => (b.score || 0) - (a.score || 0))
  }

  // 后缀最大和（用于剪枝）
  let maxSuffix = new Array(posCount + 2).fill(0)
  for (let pos = posCount; pos >= 1; pos--) {
    let best = artsByPos[pos][0]?.score || 0
    maxSuffix[pos] = best + maxSuffix[pos + 1]
  }

  // 检查是否有位置缺数据
  for (let pos = 1; pos <= posCount; pos++) {
    if (artsByPos[pos].length === 0) return null
  }

  // 贪心初始解（每位置最高分）作为剪枝下界
  let greedy = []
  let gCnt = {}
  for (let pos = 1; pos <= posCount; pos++) {
    let arti = artsByPos[pos][0]
    greedy.push(arti)
    gCnt[arti.set] = (gCnt[arti.set] || 0) + 1
  }

  let bestScore = 0
  let bestCombo = null

  if (!constraints.length || satisfiesConstraint(gCnt, constraints)) {
    bestScore = greedy.reduce((s, a) => s + (a.score || 0), 0)
    bestCombo = [...greedy]
  }

  // 回溯 DFS
  let selected = []

  function dfs (pos, setCounts, currentScore) {
    if (pos > posCount) {
      if (!constraints.length || satisfiesConstraint(setCounts, constraints)) {
        if (currentScore > bestScore) {
          bestScore = currentScore
          bestCombo = [...selected]
        }
      }
      return
    }

    // 剪枝 1：后续位置全拿最高分也无法超越当前最优
    if (currentScore + maxSuffix[pos] <= bestScore) return

    // 剪枝 2：剩余空位已无法凑齐套装所需件数
    if (constraints.length) {
      let unmet = 0
      let remain = posCount - pos + 1
      for (let c of constraints) {
        unmet += Math.max(0, c.count - (setCounts[c.set] || 0))
      }
      if (unmet > remain) return
    }

    for (let arti of artsByPos[pos]) {
      // 剪枝 3：该位置最高分（已排序）也追不上
      if (currentScore + arti.score + maxSuffix[pos + 1] <= bestScore) break

      selected[pos - 1] = arti
      let nxt = {}
      for (let k in setCounts) nxt[k] = setCounts[k]
      nxt[arti.set] = (nxt[arti.set] || 0) + 1
      dfs(pos + 1, nxt, currentScore + arti.score)
    }
  }

  dfs(1, {}, 0)
  return bestCombo
}

// 默认武器回退表
const DEF_WEAPON = {
  bow: '西风猎弓',
  catalyst: '西风秘典',
  claymore: '西风大剑',
  polearm: '西风长枪',
  sword: '西风剑'
}

/**
 * 最高分面板搭配搜索
 * 由 ProfileDetail.detail() 调用
 * @param {Object} e     - 事件对象
 * @param {Object} char  - 角色 Character 对象
 * @param {string} paramStr - 参数字符串
 * @param {string} game  - 'gs' | 'sr'
 * @param {number} uid   - 当前用户 UID
 * @returns {Promise<{profile:Avatar, char:Object, summary:string}|null>}
 */
export async function profileMaxScoreBuild (e, char, paramStr, game, uid) {
  const isGs = game === 'gs'
  const isSr = !isGs
  const POS_COUNT = isSr ? 6 : 5
  const posNames = POS_NAMES[game]

  // ============================================================
  // 阶段 1：双层解析 — 剥离搜索独有令牌 + matchMsg 解析换补
  // ============================================================
  let { setConstraints, mainStats, dmgIdx, restTokens } = parseMaxParams(paramStr, game)

  let pc = null
  if (restTokens.length) {
    let mockCmd = buildMockCmd(char.name, restTokens, game, char.weaponType)
    if (mockCmd) pc = ProfileChange.matchMsg(mockCmd)
  }

  // ============================================================
  // 阶段 2：解析锁定位置（换/补指定圣遗物位置 → 从来源取实际数据）
  // ============================================================
  let lockedByChange = {}    // change 层的锁定圣遗物
  let lockedByBase = {}      // baseChange 层的锁定圣遗物（搜索时也参与锁定）

  if (pc) {
    for (let pos = 1; pos <= POS_COUNT; pos++) {
      let key = 'arti' + pos
      if (pc.change?.[key]) {
        let resolved = resolveLockedArti(pc.change[key], uid, game)
        if (resolved) lockedByChange[pos] = { ...resolved, layer: 'change' }
      }
      if (pc.baseChange?.[key]) {
        let resolved = resolveLockedArti(pc.baseChange[key], uid, game)
        if (resolved) lockedByBase[pos] = { ...resolved, layer: 'base' }
      }
    }
  }

  // ============================================================
  // 阶段 3：收集该玩家全部 5 星圣遗物
  // ============================================================
  let allArtis = []
  let player = Player.create(uid, game)
  let profiles = player.getProfiles()

  for (let id in profiles) {
    let profile = profiles[id]
    if (!profile || !profile.hasData || !profile.hasArtis()) continue

    let profChar = profile.char
    let artisObj = profile.artis

    artisObj.forEach((arti, idx) => {
      if (!arti || !arti.main || !arti.attrs) return
      if (arti.star !== undefined && arti.star < 5) return

      let rawMain = arti.main
      let rawAttrs = arti.attrs
      let mainDisplay = ArtisMark.formatArti(rawMain, null, true, game)
      let attrsDisplay = ArtisMark.formatArtiAttrs(rawAttrs, null, game)
      let artifactInfo = Artifact.get(arti, game)
      let name = artifactInfo?.name || ''
      let abbr = artifactInfo?.abbr || name
      let img = artifactInfo?.img || ''
      let set = artifactInfo?.setName || ''

      allArtis.push({
        name, abbr, img, set,
        level: arti.level || 0,
        main: mainDisplay, attrs: attrsDisplay,
        avatar: profile.name, charId: profile.charId,
        side: profChar?.side || '', uid, idx,
        elem: profChar?.elem || '',
        charWeight: {}, star: arti.star || 5,
        _raw: {
          main: rawMain, attrs: rawAttrs, idx, set,
          mainId: arti.mainId, attrIds: arti.attrIds,
          name: arti.name, artiId: arti.id
        }
      })
    })
  }

  if (allArtis.length === 0) {
    e.reply(`你暂无 5 星${isSr ? '遗器' : '圣遗物'}数据，请先使用 #面板 获取角色面板后再查看。`)
    return null
  }

  // ============================================================
  // 阶段 4：按位置分组 + 注入锁定位置
  // ============================================================
  let artsByPos = {}
  for (let i = 1; i <= POS_COUNT; i++) artsByPos[i] = []
  for (let arti of allArtis) {
    if (artsByPos[arti.idx]) artsByPos[arti.idx].push(arti)
  }

  // 锁定位置用来源数据覆盖（单条数组 → 搜索时该位置只有这一个选择）
  // change 优先，baseChange 其次（change 层最终会覆盖 baseChange，但搜索空间只需一份）
  for (let pos of Object.keys(lockedByChange)) {
    let lk = lockedByChange[Number(pos)]
    artsByPos[Number(pos)] = [buildArtiEntry(lk.arti, lk.pos, lk.srcProfile, game)]
  }
  for (let pos of Object.keys(lockedByBase)) {
    let p = Number(pos)
    if (!lockedByChange[p]) {
      let lk = lockedByBase[p]
      artsByPos[p] = [buildArtiEntry(lk.arti, lk.pos, lk.srcProfile, game)]
    }
  }

  // ============================================================
  // 阶段 5：主词条过滤
  // ============================================================
  for (let ms of mainStats) {
    if (artsByPos[ms.pos]) {
      artsByPos[ms.pos] = artsByPos[ms.pos].filter(
        arti => arti._raw.main.key === ms.rawKey
      )
    }
  }

  // ============================================================
  // 阶段 6：检查位置缺失
  // ============================================================
  let missing = []
  for (let pos = 1; pos <= POS_COUNT; pos++) {
    if (artsByPos[pos].length === 0) missing.push(posNames[pos - 1])
  }
  if (missing.length > 0) {
    let reason = mainStats.length ? '（可能是主词条过滤导致）' : ''
    e.reply(`你的 5 星${isSr ? '遗器' : '圣遗物'}数据不完整，缺少位置：${missing.join('、')}${reason}。请先获取角色面板。`)
    return null
  }

  // ============================================================
  // 阶段 7：枚举评分规则 + 搜索
  // ============================================================
  let targetProfile = player.getProfile(char.id)
  let baseProfile = {
    char,
    weapon: targetProfile?.weapon || { name: '', affix: 1 },
    artis: { is: () => false, getSetData: () => ({ sets: {}, abbrs: [] }) },
    game, isGs, isSr,
    attr: {}, elem: char.elem,
    cons: targetProfile?.cons || 0, id: char.id,
    baseAttr: char.baseAttr || { hp: 14000, atk: 230, def: 700 }
  }
  let probeAttrs = [
    { mastery: 0, cpct: 0, cdmg: 0 },
    { mastery: 600, cpct: 50, cdmg: 200 },
    { mastery: 0, cpct: 10, cdmg: 310 }
  ]

  let seenCfg = new Map()
  for (let pa of probeAttrs) {
    let cfg = ArtisMarkCfg.getCfg({ ...baseProfile, attr: pa })
    if (cfg && !seenCfg.has(cfg.classTitle)) {
      cfg.id = char.id
      seenCfg.set(cfg.classTitle, cfg)
    }
  }

  if (seenCfg.size === 0) {
    e.reply(`无法获取${char.name}的评分规则`)
    return null
  }

  let bestTotal = 0
  let bestCombo = null
  let bestCfg = null

  for (let [title, cfg] of seenCfg) {
    let scoreFn = (arti) => recalcArtisMark(arti, cfg, game, char.elem || '')
    let combo = findBestCombination(artsByPos, setConstraints, scoreFn, POS_COUNT)
    if (combo && combo.length === POS_COUNT) {
      let total = combo.reduce((s, a) => s + (a.score || 0), 0)
      if (total > bestTotal) {
        bestTotal = total; bestCombo = combo; bestCfg = cfg
      }
    }
  }

  if (!bestCombo) {
    let label = setConstraints.length
      ? setConstraints.map(c => c.abbr + c.count).join('+')
      : '散件'
    e.reply(`未找到满足「${label}」约束的${isSr ? '遗器' : '圣遗物'}组合，可能对应套装数量不足`)
    return null
  }

  // ============================================================
  // 阶段 8：文本摘要
  // ============================================================
  let totalMark = Math.round(bestTotal * 10) / 10
  let setLabel = setConstraints.length
    ? setConstraints.map(c => c.abbr + c.count).join('+')
    : '散件'

  let ruleName = bestCfg.classTitle.replace(/^[^-]+-?/, '')

  let summaryLines = [
    `「${char.name}」最高分${isSr ? '遗器' : '面板'}（${setLabel}）`
  ]

  // 武器（换层优先，补层次之）
  let specWeapon = pc?.change?.weapon || pc?.baseChange?.weapon
  if (specWeapon?.weapon) {
    let wepInfo = Weapon.get(specWeapon.weapon, game, char.weaponType) || Weapon.get(specWeapon.weapon, game)
    let wParts = [wepInfo?.abbr || wepInfo?.name || specWeapon.weapon]
    if (specWeapon.affix) wParts.push(`精${specWeapon.affix}`)
    if (specWeapon.level) wParts.push(`${specWeapon.level}级`)
    summaryLines.push(`┃ 武器：${wParts.join(' ')}`)
  }

  // 等级（换层优先，补层次之）
  let specLevel = pc?.change?.char?.level || pc?.baseChange?.char?.level
  if (specLevel) {
    summaryLines.push(`┃ 等级：${specLevel}`)
  }

  summaryLines.push(`┃ 评分规则：${ruleName}`)
  summaryLines.push(`┃ 总评分：${totalMark}`)

  if (mainStats.length) {
    summaryLines.push(`┃ 主词条限定：${mainStats.map(m => posNames[m.pos - 1] + '→' + m.rawKey).join(' ')}`)
  }

  summaryLines.push('┃ ──────────────')

  let artiLines = bestCombo.map((arti) => {
    let posName = posNames[arti.idx - 1]
    let aset = ArtifactSet.get(arti.set, game)
    let setAbbr = aset?.meta?.abbr || arti.set
    let score = Math.round((arti.score || 0) * 10) / 10
    return `┃ ${posName}·${setAbbr}  ← ${arti.avatar}  ${score}分`
  })
  summaryLines.push(...artiLines)

  let summary = summaryLines.join('\n')

  // ============================================================
  // 阶段 9：构建虚拟面板 change 对象
  // ============================================================

  // --- 9a. 圣遗物（搜索结果 + 锁定覆盖）---
  let mergedChange = {}

  // 搜索结果的圣遗物
  for (let arti of bestCombo) {
    let pos = arti._raw.idx
    mergedChange['arti' + pos] = buildArtiChange(arti, isSr)
  }

  // 锁定位置用 change 层覆盖（高于搜索结果）
  for (let pos of Object.keys(lockedByChange)) {
    let lk = lockedByChange[Number(pos)]
    // 重新构建 raw 数据以匹配 getProfile OCR 分支格式
    let arti = lk.arti
    let rawMain = arti.main
    let rawAttrs = arti.attrs
    let artifactInfo = Artifact.get(arti, game)
    let set = artifactInfo?.setName || arti.set || ''
    let data = {
      mode: 'ocr', level: arti.level || 0,
      mainId: arti.mainId, attrIds: arti.attrIds
    }
    if (isSr) {
      data.id = arti.id || arti.name
    } else {
      data.name = arti.name
      data.star = arti.star || 5
    }
    mergedChange['arti' + Number(pos)] = data
  }

  // --- 9b. 武器 ---
  if (specWeapon?.weapon) {
    let wepInfo = Weapon.get(specWeapon.weapon, game, char.weaponType) || Weapon.get(specWeapon.weapon, game)
    mergedChange.weapon = {
      weapon: wepInfo?.name || specWeapon.weapon,
      affix: Math.min(wepInfo?.maxAffix || 5, specWeapon.affix || 5),
      level: Math.min(wepInfo?.maxLv || 90, specWeapon.level || 90)
    }
  } else {
    // 回退到目标面板武器
    let wSource = targetProfile?.weapon || {}
    let wName = wSource.name || ''
    let weaponInfo = Weapon.get(wName, game)
    if (!weaponInfo && wName) {
      weaponInfo = Weapon.get(wName, game, char.weaponType)
    }
    if (!weaponInfo) {
      wName = DEF_WEAPON[char.weaponType] || '西风剑'
      weaponInfo = Weapon.get(wName, game)
    }
    mergedChange.weapon = {
      weapon: weaponInfo?.name || '',
      affix: Math.min(weaponInfo?.maxAffix || 5, wSource.affix || 5),
      level: Math.min(weaponInfo?.maxLv || 90, wSource.level || 90)
    }
  }

  // --- 9c. 角色等级/命座/天赋（补层打底，换层覆盖）---
  let specChar = { ...(pc?.baseChange?.char || {}), ...(pc?.change?.char || {}) }
  if (!lodash.isEmpty(specChar)) {
    mergedChange.char = specChar
  }

  // --- 9d. statMods（补层 + 换层均作用于面板）---
  if (pc?.baseChange?.statMods?.length || pc?.change?.statMods?.length) {
    mergedChange.statMods = [
      ...(pc?.baseChange?.statMods || []),
      ...(pc?.change?.statMods || [])
    ]
  }

  // --- 9e. 补层 diff 基线 ---
  if (pc?.baseChange && !lodash.isEmpty(pc.baseChange)) {
    // 基线不含搜索结果，getProfile 用源面板圣遗物回退
    let baseForDiff = lodash.cloneDeep(pc.baseChange)

    // 补层未指定武器时回退到源面板武器
    if (!baseForDiff.weapon) {
      let wSource = targetProfile?.weapon || {}
      let wName = wSource.name || ''
      let weaponInfo = Weapon.get(wName, game)
      if (!weaponInfo && wName) weaponInfo = Weapon.get(wName, game, char.weaponType)
      if (!weaponInfo) {
        wName = DEF_WEAPON[char.weaponType] || '西风剑'
        weaponInfo = Weapon.get(wName, game)
      }
      baseForDiff.weapon = {
        weapon: weaponInfo?.name || '',
        affix: Math.min(weaponInfo?.maxAffix || 5, wSource.affix || 5),
        level: Math.min(weaponInfo?.maxLv || 90, wSource.level || 90)
      }
    }
    e._baseChange = baseForDiff
  }

  let virtual = ProfileChange.getProfile(uid, char.id, mergedChange, game)
  if (!virtual || !virtual.char) {
    return null
  }

  return {
    profile: virtual,
    char,
    summary
  }
}

// ──── 最强面板（全量爬山 + 真实伤害评估）────

/**
 * 评估一个圣遗物组合的实际伤害
 * @param {Array}  combo      - 圣遗物组合 [pos1, ..., posN]
 * @param {number} uid        - 用户 UID
 * @param {string} charId     - 角色 ID
 * @param {Object} mergedBase - 不含圣遗物的 change 基础（武器/等级/statMods）
 * @param {string} game       - 'gs' | 'sr'
 * @param {boolean} isSr      - 是否为星轨
 * @param {number} enemyLv    - 敌人等级
 * @param {number} dmgIdx     - 伤害序号
 * @returns {Promise<number>} 期望伤害 avg，失败返回 -Infinity
 */
async function evalCombo (combo, uid, charId, mergedBase, game, isSr, enemyLv, dmgIdx) {
  let change = lodash.cloneDeep(mergedBase)
  for (let arti of combo) {
    change['arti' + arti._raw.idx] = buildArtiChange(arti, isSr)
  }
  let profile = ProfileChange.getProfile(uid, charId, change, game)
  if (!profile?.char) return -Infinity
  try {
    let calc = await profile.calcDmg({ enemyLv, mode: 'profile', dmgIdx })
    let avg = calc?.ret?.[dmgIdx]?.avg
    return (avg && isFinite(avg)) ? avg : -Infinity
  } catch (_) {
    return -Infinity
  }
}

/**
 * 计算组合的套装名字计数
 * @param {Array} combo - 圣遗物组合
 * @returns {Object} { setName: count }
 */
function countSets (combo) {
  let cnt = {}
  for (let arti of combo) {
    if (arti.set) cnt[arti.set] = (cnt[arti.set] || 0) + 1
  }
  return cnt
}

/**
 * 最强面板搭配搜索（基于真实伤害全量爬山）
 * 由 ProfileDetail.detail() 早期分流调用
 * @param {Object} e          - 事件对象
 * @param {Object} char       - 角色 Character 对象
 * @param {string} paramStr   - 参数字符串
 * @param {string} game       - 'gs' | 'sr'
 * @param {number} uid        - 当前用户 UID
 * @param {number} routeDmgIdx - 路由正则捕获的伤害序号
 * @returns {Promise<{profile:Avatar, char:Object, summary:string}|null>}
 */
export async function profileMaxDmgBuild (e, char, paramStr, game, uid, routeDmgIdx = 0) {
  const isGs = game === 'gs'
  const isSr = !isGs
  const POS_COUNT = isSr ? 6 : 5
  const posNames = POS_NAMES[game]

  // ============================================================
  // 阶段 1：双层解析 — 剥离搜索独有令牌 + matchMsg 解析换补
  // ============================================================
  let { setConstraints, mainStats, dmgIdx: paramDmgIdx, restTokens } = parseMaxParams(paramStr, game)
  let dmgIdx = routeDmgIdx || paramDmgIdx

  let pc = null
  if (restTokens.length) {
    let mockCmd = buildMockCmd(char.name, restTokens, game, char.weaponType)
    if (mockCmd) pc = ProfileChange.matchMsg(mockCmd)
  }

  // ============================================================
  // 阶段 2：解析锁定位置
  // ============================================================
  let lockedByChange = {}
  let lockedByBase = {}
  if (pc) {
    for (let pos = 1; pos <= POS_COUNT; pos++) {
      let key = 'arti' + pos
      if (pc.change?.[key]) {
        let resolved = resolveLockedArti(pc.change[key], uid, game)
        if (resolved) lockedByChange[pos] = { ...resolved, layer: 'change' }
      }
      if (pc.baseChange?.[key]) {
        let resolved = resolveLockedArti(pc.baseChange[key], uid, game)
        if (resolved) lockedByBase[pos] = { ...resolved, layer: 'base' }
      }
    }
  }

  // ============================================================
  // 阶段 3：收集全部 5 星圣遗物
  // ============================================================
  let allArtis = []
  let player = Player.create(uid, game)
  let profiles = player.getProfiles()

  for (let id in profiles) {
    let profile = profiles[id]
    if (!profile || !profile.hasData || !profile.hasArtis()) continue
    let profChar = profile.char
    let artisObj = profile.artis
    artisObj.forEach((arti, idx) => {
      if (!arti || !arti.main || !arti.attrs) return
      if (arti.star !== undefined && arti.star < 5) return
      let rawMain = arti.main
      let rawAttrs = arti.attrs
      let mainDisplay = ArtisMark.formatArti(rawMain, null, true, game)
      let attrsDisplay = ArtisMark.formatArtiAttrs(rawAttrs, null, game)
      let artifactInfo = Artifact.get(arti, game)
      let name = artifactInfo?.name || ''
      let abbr = artifactInfo?.abbr || name
      let img = artifactInfo?.img || ''
      let set = artifactInfo?.setName || ''
      allArtis.push({
        name, abbr, img, set,
        level: arti.level || 0,
        main: mainDisplay, attrs: attrsDisplay,
        avatar: profile.name, charId: profile.charId,
        side: profChar?.side || '', uid, idx,
        elem: profChar?.elem || '',
        charWeight: {}, star: arti.star || 5,
        _raw: {
          main: rawMain, attrs: rawAttrs, idx, set,
          mainId: arti.mainId, attrIds: arti.attrIds,
          name: arti.name, artiId: arti.id
        }
      })
    })
  }

  if (allArtis.length === 0) {
    e.reply(`你暂无 5 星${isSr ? '遗器' : '圣遗物'}数据，请先使用 #面板 获取角色面板后再查看。`)
    return null
  }

  // ============================================================
  // 阶段 4：按位置分组 + 注入锁定
  // ============================================================
  let artsByPos = {}
  for (let i = 1; i <= POS_COUNT; i++) artsByPos[i] = []
  for (let arti of allArtis) {
    if (artsByPos[arti.idx]) artsByPos[arti.idx].push(arti)
  }
  for (let pos of Object.keys(lockedByChange)) {
    let lk = lockedByChange[Number(pos)]
    artsByPos[Number(pos)] = [buildArtiEntry(lk.arti, lk.pos, lk.srcProfile, game)]
  }
  for (let pos of Object.keys(lockedByBase)) {
    let p = Number(pos)
    if (!lockedByChange[p]) {
      let lk = lockedByBase[p]
      artsByPos[p] = [buildArtiEntry(lk.arti, lk.pos, lk.srcProfile, game)]
    }
  }

  // ============================================================
  // 阶段 5：主词条过滤
  // ============================================================
  for (let ms of mainStats) {
    if (artsByPos[ms.pos]) {
      artsByPos[ms.pos] = artsByPos[ms.pos].filter(arti => arti._raw.main.key === ms.rawKey)
    }
  }

  // ============================================================
  // 阶段 6：检查位置缺失
  // ============================================================
  let missing = []
  for (let pos = 1; pos <= POS_COUNT; pos++) {
    if (artsByPos[pos].length === 0) missing.push(posNames[pos - 1])
  }
  if (missing.length > 0) {
    let reason = mainStats.length ? '（可能是主词条过滤导致）' : ''
    e.reply(`你的 5 星${isSr ? '遗器' : '圣遗物'}数据不完整，缺少位置：${missing.join('、')}${reason}。请先获取角色面板。`)
    return null
  }

  // ============================================================
  // 阶段 7：获取敌人等级
  // ============================================================
  let enemyLv = 80
  if (game === 'gs') {
    try {
      let selfUser = await MysApi.initUser(e)
      if (selfUser) enemyLv = await selfUser.getCfg('char.enemyLv', 103)
    } catch (_) { enemyLv = 103 }
  }

  // ============================================================
  // 阶段 8：mark 评分打底，findBestCombination 拿初始解
  // ============================================================
  let targetProfile = player.getProfile(char.id)
  let baseProfile = {
    char,
    weapon: targetProfile?.weapon || { name: '', affix: 1 },
    artis: { is: () => false, getSetData: () => ({ sets: {}, abbrs: [] }) },
    game, isGs, isSr,
    attr: {}, elem: char.elem,
    cons: targetProfile?.cons || 0, id: char.id,
    baseAttr: char.baseAttr || { hp: 14000, atk: 230, def: 700 }
  }
  let probeAttrs = [
    { mastery: 0, cpct: 0, cdmg: 0 },
    { mastery: 600, cpct: 50, cdmg: 200 },
    { mastery: 0, cpct: 10, cdmg: 310 }
  ]

  let seenCfg = new Map()
  for (let pa of probeAttrs) {
    let cfg = ArtisMarkCfg.getCfg({ ...baseProfile, attr: pa })
    if (cfg && !seenCfg.has(cfg.classTitle)) {
      cfg.id = char.id
      seenCfg.set(cfg.classTitle, cfg)
    }
  }

  if (seenCfg.size === 0) {
    e.reply(`无法获取${char.name}的评分规则`)
    return null
  }

  let bestTotal = 0
  let initialCombo = null
  for (let [title, cfg] of seenCfg) {
    let scoreFn = (arti) => recalcArtisMark(arti, cfg, game, char.elem || '')
    let combo = findBestCombination(artsByPos, setConstraints, scoreFn, POS_COUNT)
    if (combo && combo.length === POS_COUNT) {
      let total = combo.reduce((s, a) => s + (a.score || 0), 0)
      if (total > bestTotal) {
        bestTotal = total; initialCombo = combo
      }
    }
  }

  if (!initialCombo) {
    let label = setConstraints.length
      ? setConstraints.map(c => c.abbr + c.count).join('+')
      : '散件'
    e.reply(`未找到满足「${label}」约束的${isSr ? '遗器' : '圣遗物'}组合，可能对应套装数量不足`)
    return null
  }

  // ============================================================
  // 阶段 9：构建 mergedBase（武器 + 等级 + statMods，不含圣遗物）
  // ============================================================
  let specWeapon = pc?.change?.weapon || pc?.baseChange?.weapon
  let specChar = { ...(pc?.baseChange?.char || {}), ...(pc?.change?.char || {}) }

  let mergedBase = {}
  if (specWeapon?.weapon) {
    let wepInfo = Weapon.get(specWeapon.weapon, game, char.weaponType) || Weapon.get(specWeapon.weapon, game)
    mergedBase.weapon = {
      weapon: wepInfo?.name || specWeapon.weapon,
      affix: Math.min(wepInfo?.maxAffix || 5, specWeapon.affix || 5),
      level: Math.min(wepInfo?.maxLv || 90, specWeapon.level || 90)
    }
  }
  if (!lodash.isEmpty(specChar)) mergedBase.char = specChar
  // 换层 + 补层 statMods 均作用于最终面板，合并进 mergedBase 供 evalCombo 使用
  if (pc?.baseChange?.statMods?.length || pc?.change?.statMods?.length) {
    mergedBase.statMods = [
      ...(pc?.baseChange?.statMods || []),
      ...(pc?.change?.statMods || [])
    ]
  }

  // ============================================================
  // 阶段 10：全量爬山（真实 calcDmg 评估）
  // ============================================================
  let bestCombo = [...initialCombo]
  let bestDmg = await evalCombo(bestCombo, uid, char.id, mergedBase, game, isSr, enemyLv, dmgIdx)
  if (!isFinite(bestDmg) || bestDmg <= 0) {
    e.reply(`${char.name} 伤害计算失败，请检查伤害计算规则是否可用`)
    return null
  }

  let improved = true
  let maxIter = 2
  for (let iter = 0; iter < maxIter && improved; iter++) {
    improved = false
    for (let pos = 1; pos <= POS_COUNT; pos++) {
      // 锁定位置只有 1 候选，跳过
      if (artsByPos[pos].length <= 1) continue

      for (let arti of artsByPos[pos]) {
        if (arti === bestCombo[pos - 1]) continue

        let candidate = [...bestCombo]
        candidate[pos - 1] = arti

        // 套装约束检查
        let setCnt = countSets(candidate)
        if (setConstraints.length && !satisfiesConstraint(setCnt, setConstraints)) continue

        let dmg = await evalCombo(candidate, uid, char.id, mergedBase, game, isSr, enemyLv, dmgIdx)
        if (dmg > bestDmg) {
          bestCombo = candidate
          bestDmg = dmg
          improved = true
          break
        }
      }
      if (improved) break
    }
  }

  // ============================================================
  // 阶段 11：构建虚拟面板 change 对象
  // ============================================================

  // --- 11a. 圣遗物（爬山结果 + 锁定覆盖）---
  let mergedChange = lodash.cloneDeep(mergedBase)
  for (let arti of bestCombo) {
    let pos = arti._raw.idx
    mergedChange['arti' + pos] = buildArtiChange(arti, isSr)
  }
  for (let pos of Object.keys(lockedByChange)) {
    let lk = lockedByChange[Number(pos)]
    let arti = lk.arti
    let data = { mode: 'ocr', level: arti.level || 0, mainId: arti.mainId, attrIds: arti.attrIds }
    if (isSr) data.id = arti.id || arti.name
    else { data.name = arti.name; data.star = arti.star || 5 }
    mergedChange['arti' + Number(pos)] = data
  }

  // --- 11b. 武器（mergedBase 未包含时回退）---
  if (!mergedChange.weapon) {
    let wSource = targetProfile?.weapon || {}
    let wName = wSource.name || ''
    let weaponInfo = Weapon.get(wName, game)
    if (!weaponInfo && wName) weaponInfo = Weapon.get(wName, game, char.weaponType)
    if (!weaponInfo) {
      wName = DEF_WEAPON[char.weaponType] || '西风剑'
      weaponInfo = Weapon.get(wName, game)
    }
    mergedChange.weapon = {
      weapon: weaponInfo?.name || '',
      affix: Math.min(weaponInfo?.maxAffix || 5, wSource.affix || 5),
      level: Math.min(weaponInfo?.maxLv || 90, wSource.level || 90)
    }
  }

  // --- 11c. 补层 diff 基线 ---
  if (pc?.baseChange && !lodash.isEmpty(pc.baseChange)) {
    let baseForDiff = lodash.cloneDeep(pc.baseChange)
    if (!baseForDiff.weapon) {
      let wSource = targetProfile?.weapon || {}
      let wName = wSource.name || ''
      let weaponInfo = Weapon.get(wName, game)
      if (!weaponInfo && wName) weaponInfo = Weapon.get(wName, game, char.weaponType)
      if (!weaponInfo) {
        wName = DEF_WEAPON[char.weaponType] || '西风剑'
        weaponInfo = Weapon.get(wName, game)
      }
      baseForDiff.weapon = {
        weapon: weaponInfo?.name || '',
        affix: Math.min(weaponInfo?.maxAffix || 5, wSource.affix || 5),
        level: Math.min(weaponInfo?.maxLv || 90, wSource.level || 90)
      }
    }
    e._baseChange = baseForDiff
  }

  let virtual = ProfileChange.getProfile(uid, char.id, mergedChange, game)
  if (!virtual || !virtual.char) return null

  // ============================================================
  // 阶段 12：预计算伤害及原面板对比（摘要用）
  // ============================================================
  let bestDmgCalc = await virtual.calcDmg({ enemyLv, mode: 'profile', dmgIdx })
  let bestDmgRet = bestDmgCalc?.ret?.[dmgIdx]
  let bestAvgNum = bestDmgRet?.avg || 0
  let dmgTitle = bestDmgRet?.title || ''

  // 原面板伤害（换补后、搜索前）
  let originalAvgNum = 0
  try {
    // 用 mergedBase 构建原面板（无圣遗物 → getProfile 回退源面板）
    let origProfile = ProfileChange.getProfile(uid, char.id, mergedBase, game)
    if (origProfile?.char) {
      let origCalc = await origProfile.calcDmg({ enemyLv, mode: 'profile', dmgIdx })
      originalAvgNum = origCalc?.ret?.[dmgIdx]?.avg || 0
    }
  } catch (_) { /* 静默 */ }

  let improvePct = ''
  if (originalAvgNum > 0 && bestAvgNum > 0) {
    let pct = ((bestAvgNum - originalAvgNum) / originalAvgNum * 100)
    improvePct = pct > 0 ? `↑${pct.toFixed(1)}%` : `（${pct.toFixed(1)}%）`
  }

  // ============================================================
  // 阶段 13：文本摘要
  // ============================================================
  let setLabel = setConstraints.length
    ? setConstraints.map(c => c.abbr + c.count).join('+')
    : '散件'

  let summaryLines = [
    `「${char.name}」最强面板（${setLabel}）`
  ]

  if (specWeapon?.weapon) {
    let wepInfo = Weapon.get(specWeapon.weapon, game, char.weaponType) || Weapon.get(specWeapon.weapon, game)
    let wParts = [wepInfo?.abbr || wepInfo?.name || specWeapon.weapon]
    if (specWeapon.affix) wParts.push(`精${specWeapon.affix}`)
    if (specWeapon.level) wParts.push(`${specWeapon.level}级`)
    summaryLines.push(`┃ 武器：${wParts.join(' ')}`)
  }

  let specLevel = pc?.change?.char?.level || pc?.baseChange?.char?.level
  if (specLevel) summaryLines.push(`┃ 等级：${specLevel}`)

  let dmgInfo = `┃ 期望伤害：${Format.comma(bestAvgNum, 0)}`
  if (dmgTitle) dmgInfo += `（${dmgTitle}）`
  if (improvePct) dmgInfo += `  ${improvePct}`
  summaryLines.push(dmgInfo)

  if (mainStats.length) {
    summaryLines.push(`┃ 主词条限定：${mainStats.map(m => posNames[m.pos - 1] + '→' + m.rawKey).join(' ')}`)
  }

  summaryLines.push('┃ ──────────────')

  let artiLines = bestCombo.map((arti) => {
    let posName = posNames[arti.idx - 1]
    let aset = ArtifactSet.get(arti.set, game)
    let setAbbr = aset?.meta?.abbr || arti.set
    return `┃ ${posName}·${setAbbr}  ← ${arti.avatar}`
  })
  summaryLines.push(...artiLines)

  let summary = summaryLines.join('\n')

  return { profile: virtual, char, summary }
}
