/*
* 角色圣遗物评分详情
*
* */
import lodash from 'lodash'
import { Cfg, Common, Meta } from '#miao'
import { getTargetUid, profileHelp, getProfileRefresh } from './ProfileCommon.js'
import { Artifact, ArtifactSet, Button, Character, Player, ProfileRank } from '#miao.models'
import ArtisMarkCfg from '../../models/artis/ArtisMarkCfg.js'
import ArtisMark from '../../models/artis/ArtisMark.js'

/*
* 角色圣遗物面板
* */
export async function profileArtis (e) {
  let { uid, avatar } = e
  let profile = e._profile || await getProfileRefresh(e, avatar)
  if (!profile) {
    return true
  }
  if (!profile.hasArtis()) {
    e.reply('未能获得圣遗物详情，请重新获取面板信息后查看')
    return true
  }
  let char = profile.char
  let { game } = char
  let charCfg = ArtisMarkCfg.getCfg(profile)

  let { attrMap } = Meta.getMeta(game, 'arti')

  let artisDetail = profile.getArtisMark()
  let artisKeyTitle = Artifact.getArtisKeyTitle(game)

  // 渲染图像
  return e.reply([await Common.render('character/artis-mark', {
    uid,
    elem: char.elem,
    splash: profile.costumeSplash,
    imgs: profile.imgs,
    data: profile,
    costume: profile.costume ? '2' : '',
    artisDetail,
    artisKeyTitle,
    attrMap,
    charCfg,
    game,
    changeProfile: e._profileMsg
  }, { e, scale: 1.6 / 1.1, retType: 'base64' }), new Button(e).profile(char, uid)])
}

/*
* 圣遗物列表
* */
export async function profileArtisList (e) {
  let game = /星铁|遗器/.test(e.msg) ? 'sr' : 'gs'
  e.isSr = game === 'sr'

  let uid = await getTargetUid(e)
  if (!uid) {
    return true
  }

  let artis = []
  let player = Player.create(uid, game)
  player.forEachAvatar((avatar) => {
    let profile = avatar.getProfile()
    if (!profile) {
      return true
    }
    let name = profile.name
    let char = Character.get(name, game)
    if (!profile.hasData || !profile.hasArtis()) {
      return true
    }
    let profileArtis = profile.getArtisMark()
    lodash.forEach(profileArtis.artis, (arti, idx) => {
      arti.charWeight = profileArtis.charWeight
      arti.avatar = name
      arti.side = char.side
      artis.push(arti)
    })
  })

  if (artis.length === 0) {
    let artisName = game === 'gs' ? '圣遗物' : '遗器'
    e.reply(`请先获取角色面板数据后再查看${artisName}列表...`)
    await profileHelp(e)
    return true
  }
  artis = lodash.sortBy(artis, '_mark')
  artis = artis.reverse()
  let number = Cfg.get('artisNumber', 28)
  artis = artis.slice(0, `${number}`)
  let artisKeyTitle = Artifact.getArtisKeyTitle(game)

  // 渲染图像
  return await Common.render('character/artis-list', {
    save_id: uid,
    uid,
    artis,
    artisKeyTitle
  }, { e, scale: 1.4 })
}

/*
 * 圣遗物列表/统计（统一入口）
 * 指令矩阵：
 *   #圣遗物列表               → 自己，不改权重（原版，委托 profileArtisList）
 *   #<角色>圣遗物列表          → 自己，用角色权重重算
 *   #圣遗物全局列表            → 全群，不改权重
 *   #<角色>圣遗物全局列表      → 全群，用角色权重重算
 * 额外：末尾可追加套装名过滤。列表/统计可互换，遗器/圣遗物均支持
 */
export async function unifiedArtisHandler (e) {
  let msg = e.original_msg || e.msg
  if (!msg) return false

  let m = /^#(星铁|原神)?(.*?)(圣遗物|遗器)(全局)?(列表|统计)\s*(.*)$/.exec(msg)
  if (!m) return false

  let game = m[1] === '星铁' ? 'sr' : 'gs'
  let charInput = m[2].trim()
  let isGlobal = !!m[4]
  let setFilter = m[6].trim()

  e.isSr = game === 'sr'

  // 全局范围需群内
  if (isGlobal && !e.group_id) {
    e.reply('该指令仅限群内使用')
    return true
  }

  // 解析角色（支持别名）
  let char = charInput ? Character.get(charInput, game) : null
  if (charInput && !char) {
    e.reply(`未找到角色「${charInput}」`)
    return true
  }

  // === 收集圣遗物 ===
  let allArtis
  let uid

  if (isGlobal) {
    allArtis = await collectAllGroupArtisRaw(e, game)
  } else if (!charInput) {
    // 原版路径：不改权重
    return await profileArtisList(e)
  } else {
    uid = await getTargetUid(e)
    if (!uid) return true
    allArtis = await collectSelfArtisRaw(uid, game)
  }

  if (!allArtis || allArtis.length === 0) {
    let artisName = game === 'gs' ? '圣遗物' : '遗器'
    e.reply('暂无' + artisName + '数据，请先获取角色面板后再查看。')
    await profileHelp(e)
    return true
  }

  // === 重算权重（有角色名时） ===
  if (char) {
    let charCfg = buildFakeProfileAndGetCfg(char, game)
    if (!charCfg) {
      e.reply('无法获取' + char.name + '的评分规则')
      return true
    }
    charCfg.id = char.id
    lodash.forEach(allArtis, (arti) => {
      arti._mark = recalcArtisMark(arti, charCfg, game, char.elem)
      arti.mark = String(arti._mark)
      arti.markClass = ArtisMark.getMarkClass(arti._mark)
    })
  }

  // === 套装过滤 ===
  if (setFilter) {
    let targetSet = resolveArtifactSet(setFilter, game)
    if (!targetSet) {
      let artisName = game === 'gs' ? '圣遗物' : '遗器'
      e.reply('未找到对应' + artisName + '套装：「' + setFilter + '」')
      return true
    }
    allArtis = allArtis.filter(a => a.set === targetSet)
    if (allArtis.length === 0) {
      e.reply('未找到属于「' + setFilter + '」套装的' + (game === 'gs' ? '圣遗物' : '遗器'))
      return true
    }
  }

  // === 排序 & 截断 ===
  allArtis = lodash.sortBy(allArtis, '_mark')
  allArtis = allArtis.reverse()
  let number = Cfg.get('artisNumber', 28)
  allArtis = allArtis.slice(0, Number(number))

  // 全局模式：用 UID 覆写 name 以区分归属
  if (isGlobal) {
    lodash.forEach(allArtis, (arti) => {
      arti.name = String(arti.uid)
      arti.abbr = String(arti.uid)
    })
  }

  let artisKeyTitle = Artifact.getArtisKeyTitle(game)
  return await Common.render('character/artis-list', {
    save_id: isGlobal ? e.group_id : uid,
    uid: isGlobal ? 'group' : uid,
    artis: allArtis,
    artisKeyTitle
  }, { e, scale: 1.4 })
}

// ========== 辅助函数 ==========

/**
 * 收集单个用户的全角色圣遗物（含原始数据，用于重算权重）
 */
async function collectSelfArtisRaw (uid, game) {
  let allArtis = []
  let player = Player.create(uid, game)
  player.forEachAvatar((avatar) => {
    let profile = avatar.getProfile()
    if (!profile || !profile.hasData || !profile.hasArtis()) return
    let charWeight = profile.getArtisMark().charWeight || {}
    profile.artis.forEach((arti, idx) => {
      let formatted = _formatOneArti(arti, idx, profile, charWeight, uid, game)
      if (formatted) allArtis.push(formatted)
    })
  })
  return allArtis
}

/**
 * 收集全群所有成员的圣遗物（含原始数据，用于重算权重）
 */
async function collectAllGroupArtisRaw (e, game) {
  let uidMap = await ProfileRank.getUserUidMap(e, game)
  if (!uidMap || Object.keys(uidMap).length === 0) return []
  let allArtis = []
  for (let uid in uidMap) {
    // 跳过系统预留 UID（100000000–100000009：极限角色/预设数据）
    if (/^10000000\d$/.test(uid)) continue
    let player = Player.create(uid, game)
    let profiles = player.getProfiles()
    for (let id in profiles) {
      let profile = profiles[id]
      if (!profile || !profile.hasData || !profile.hasArtis()) continue
      let charWeight = profile.getArtisMark().charWeight || {}
      profile.artis.forEach((arti, idx) => {
        let formatted = _formatOneArti(arti, idx, profile, charWeight, uid, game)
        if (formatted) allArtis.push(formatted)
      })
    }
  }
  return allArtis
}

/**
 * 将原始圣遗物格式化为渲染所需的数据结构
 */
function _formatOneArti (arti, idx, profile, charWeight, uid, game) {
  if (!arti || !arti.main || !arti.attrs) return null
  let artiInfo = Artifact.get(arti, game)
  let char = profile.char || profile._char
  let artisMark = profile.getArtisMark()
  let preMark = artisMark?.artis?.[idx]
  return {
    name: artiInfo?.name || '',
    abbr: artiInfo?.abbr || '',
    img: artiInfo?.img || '',
    set: artiInfo?.setName || '',
    level: arti.level || 0,
    main: ArtisMark.formatArti(arti.main, null, true, game),
    attrs: ArtisMark.formatArtiAttrs(arti.attrs, null, game),
    avatar: profile.name,
    charId: profile.charId,
    side: char?.side || '',
    uid,
    idx,
    elem: char?.elem || '',
    charWeight,
    _mark: preMark?._mark || 0,
    mark: preMark?.mark || '0',
    markClass: preMark?.markClass || 'D',
    _raw: { main: arti.main, attrs: arti.attrs, idx, set: artiInfo?.setName || '' }
  }
}

/**
 * 用目标角色评分规则重算单件圣遗物评分
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
 * 构建假 Profile 以获取目标角色的评分配置
 */
function buildFakeProfileAndGetCfg (char, game) {
  let fakeProfile = {
    char,
    weapon: { name: '', affix: 1 },
    artis: { is: () => false, getSetData: () => ({ sets: {}, abbrs: [] }) },
    game,
    isGs: game === 'gs',
    isSr: game === 'sr',
    attr: {},
    elem: char.elem,
    cons: 0,
    id: char.id,
    baseAttr: char.baseAttr || { hp: 14000, atk: 230, def: 700 }
  }
  return ArtisMarkCfg.getCfg(fakeProfile)
}

/**
 * 圣遗物套装名解析（支持别名）
 */
function resolveArtifactSet (filter, game) {
  // 直接查 ArtifactSet（内部已支持别名）
  let set = ArtifactSet.get(filter, game)
  if (set) return set.name
  // Meta 别名匹配
  let aliases = Meta.getAlias(game, 'artiSet')
  let sorted = [...aliases].sort((a, b) => b.length - a.length)
  for (let alias of sorted) {
    if (alias.includes(filter) || filter.includes(alias)) {
      let set = ArtifactSet.get(alias, game)
      if (set) return set.name
    }
  }
  return null
}
