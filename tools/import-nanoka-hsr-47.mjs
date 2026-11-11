// 从 nanoka 4.7 快照生成 apply_patch 补丁；不直接改写项目数据。
// 在 bot 根目录运行：node plugins/miao-plugin/tools/import-nanoka-hsr-47.mjs
import fs from 'node:fs'
import path from 'node:path'

const root = 'plugins/miao-plugin/resources/meta-sr/'
const cache = 'temp/nanoka-hsr-4.7/'
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const raw = file => read(cache + file + '.json')
const round = n => Number(n.toFixed(6))
const clean = s => (s || '').replace(/\\n/g, '\n').replace(/<\/?color[^>]*>/g, '').replace(/<\/?u>/g, '').replace(/<unbreak>/g, '<nobr>').replace(/<\/unbreak>/g, '</nobr>')
const fixed = (s, params) => clean(s).replace(/#(\d+)\[(i|f1|f2)\](%?)/g, (_, id, fmt, pct) => {
  const n = params[Number(id) - 1]
  if (n === undefined) throw new Error(`缺少参数 ${id}: ${s}`)
  return round(n * (pct ? 100 : 1)) + pct
})
const cost = list => Object.fromEntries((list || []).map(m => [m.item_id, m.item_num]))
const patches = []
const assets = []
const image = (file, resource) => assets.push({ file: root + file, url: `https://static.nanoka.cc/assets/hsr/${resource}.webp` })
const add = (file, data) => {
  if (fs.existsSync(root + file)) throw new Error(`拒绝覆盖已有文件 ${file}`)
  patches.push(`*** Add File: ${root + file}\n` + (JSON.stringify(data, null, 2) + '\n').trimEnd().split('\n').map(l => '+' + l).join('\n'))
}
const insert = (file, entries) => {
  const existing = read(root + file)
  for (const id of Object.keys(entries)) if (existing[id]) throw new Error(`索引已存在 ${file}: ${id}`)
  const groups = new Map()
  for (const id of Object.keys(entries).sort((a, b) => a - b)) {
    const next = Object.keys(existing).filter(k => Number(k) > Number(id)).sort((a, b) => a - b)[0] || ''
    if (!groups.has(next)) groups.set(next, {})
    groups.get(next)[id] = entries[id]
  }
  const hunks = []
  for (const [next, group] of groups) {
    const lines = JSON.stringify(group, null, 2).split('\n').slice(1, -1)
    if (next) {
      lines[lines.length - 1] += ','
      hunks.push('@@\n' + lines.map(l => '+' + l).join('\n') + `\n   "${next}": {`)
    } else {
      const tail = fs.readFileSync(root + file, 'utf8').trimEnd().split(/\r?\n/).slice(-5)
      const replacement = [...tail.slice(0, -2), tail.at(-2) + ',', ...lines, '}']
      hunks.push('@@\n' + tail.map(l => '-' + l).join('\n') + '\n' + replacement.map(l => '+' + l).join('\n'))
    }
  }
  patches.push(`*** Update File: ${root + file}\n` + hunks.join('\n'))
}

const r = raw('character-1511')
const points = Object.values(r.skill_trees).map(v => v['1'])
const skillKeys = { 151101: 'a', 151102: 'e', 151103: 'q', 151104: 't', 151107: 'z', 151120: 'xe', 151129: 't2', 151131: 't3' }
const names = {
  a: ['欢愉伤害', '参数2'],
  e: ['令使欢愉度提高', '追加攻击欢愉伤害', '参数3', '参数4', '参数5', '愿力恢复'],
  q: ['愿力需求', '全体欢愉伤害', '弹射次数', '单次弹射欢愉伤害', '阿哈行动提前', '持续回合'],
  t: ['参数1', '笑点触发门槛', '额外愿力', '参数4', '参数5', '参数6', '行动愿力', '愿力需求', '全队暴击伤害提高', '持续回合', '愿力溢出上限'],
  z: ['固定笑点', '领域持续时间'], xe: ['欢愉伤害', '真实伤害比例'],
  t2: ['爽点返还比例', '无视防御力', '暴击率提高'], t3: ['欢愉负债比例', '参数2', '欢愉负债上限']
}
const c = {
  id: 1511, key: raw('character')['1511'].icon, name: r.name, star: 5, elem: '量子',
  eta: 1794326400000,
  allegiance: r.chara_info.camp, weapon: '欢愉', sp: r.sp_need, desc: clean(r.desc),
  cncv: r.chara_info.va.chinese, jpcv: r.chara_info.va.japanese,
  baseAttr: {}, growAttr: {}, materials: {}, 'talent-materials': {}, talentId: {},
  talentCons: { 3: 'q', 5: 'e', a: 3, e: 5, q: 3, t: 5, xe: [3, 5] },
  talent: {}, cons: {}, attr: [], tree: {}, treeData: {}
}
for (const [i, s] of Object.entries(r.stats)) {
  const grow = { atk: s.attack_add, hp: s.hp_add, def: s.defence_add, speed: 0 }
  const attrs = { atk: s.attack_base, hp: s.hp_base, def: s.defence_base, speed: s.speed_base, cpct: s.critical_chance * 100, cdmg: s.critical_damage * 100, aggro: s.base_aggro }
  c.attr.push({ promote: Number(i), maxLevel: [20, 30, 40, 50, 60, 70, 80][i], cost: cost(s.cost), grow, attrs })
  if (i === '6') {
    c.growAttr = grow
    c.baseAttr = { ...attrs, ...Object.fromEntries(['atk', 'hp', 'def'].map(k => [k, round(attrs[k] + 79 * grow[k])])) }
  }
}
for (const [id, key] of Object.entries(skillKeys)) {
  const s = r.skills[id]
  const levels = Object.values(s.level)
  // 升格行迹的第二级由二魂解锁，不作为普通技能等级显示。
  const usedLevels = key === 't2' ? levels.slice(0, 1) : levels
  const tables = {}
  const desc = clean(s.desc).replace(/#(\d+)\[/g, '$$$1[')
  for (let i = 0; i < usedLevels[0].param_list.length; i++) {
    const values = usedLevels.map(l => l.param_list[i])
    const same = values.every(v => v === values[0])
    tables[i + 1] = { name: names[key][i], isSame: same, values }
  }
  c.talent[key] = { id: Number(id), name: s.name, type: s.type_name || ({ t: '天赋', t2: '命途升格', t3: '固有行迹' }[key]), tag: ({ SingleAttack: '单攻', AoEAttack: '群攻', Support: '辅助', Enhance: '强化' }[s.tag] || s.tag), desc, tables }
  const point = points.find(p => p.level_up_skill_id.includes(Number(id)))
  if (point) c.talentId[point.point_id] = key
  // 单级固有技能直接替换数值，避免界面按 lv8 取值为空。
  if (usedLevels.length === 1) c.talent[key].desc = fixed(s.desc, usedLevels[0].param_list)
}
for (const [i, rank] of Object.entries(r.ranks)) {
  let desc = rank.desc
  for (const ref of rank.description_refs || []) {
    desc = desc.replace(ref.token, ref.entries.map(e => `${clean(e.avatar_name)} · ${e.name}：${fixed(e.desc, e.param_list)}`).join('\n'))
  }
  c.cons[i] = { name: rank.name, desc: fixed(desc, rank.param_list) }
  image(`character/${c.name}/imgs/cons-${i}.webp`, 'skillicons/' + rank.icon.replace('.png', ''))
}
const prop = { CriticalChanceBase: ['cpct', 100], CriticalDamageBase: ['cdmg', 100], SpeedDelta: ['speed', 1] }
for (const p of points.filter(p => p.point_type === 1 || p.point_type === 3 || p.point_type === 6)) {
  const buffs = p.point_type === 1
  const entry = { id: p.point_id, type: buffs ? 'buff' : 'skill', root: p.pre_point.length === 0, name: p.point_name, levelReq: p.avatar_level_limit || 0, desc: fixed(p.point_desc, p.param_list), cost: cost(p.material_list) }
  if (buffs) {
    entry.data = {}
    for (const a of p.status_add_list) {
      const [key, scale] = prop[a.property_type] || []
      if (!key) throw new Error(`未知属性 ${a.property_type}`)
      const value = round(a.value * scale)
      c.tree[p.point_id] = { key, value }
      entry.data[key] = value
    }
  } else {
    entry.idx = p.point_type === 6 ? 4 : p.point_id - 1511100
    image(`character/${c.name}/imgs/tree-${entry.idx}.webp`, 'skillicons/' + p.icon.replace('.png', ''))
  }
  const children = points.filter(child => child.pre_point.includes(p.point_id)).map(p => String(p.point_id))
  if (children.length) entry.children = children
  c.treeData[p.point_id] = entry
}
const materialIndex = read(root + 'material/data.json')
const totals = {}
const sumCost = list => { for (const m of list) totals[m.item_id] = (totals[m.item_id] || 0) + m.item_num }
Object.values(r.stats).forEach(s => sumCost(s.cost))
for (const levels of Object.values(r.skill_trees)) for (const [lv, p] of Object.entries(levels)) {
  // 六级普攻、十级战技/终结技/天赋/欢愉技以及全部行迹。
  const max = p.level_up_skill_id.includes(151101) ? 6 : 10
  if (Number(lv) <= max) sumCost(p.material_list)
}
for (const [kind, id] of Object.entries({ ascension: 110443, assignment: 116003, calyx: 110263, weekly: 110509 })) {
  if (!materialIndex[id]) throw new Error(`缺少素材 ${id}`)
  c.materials[kind] = materialIndex[id].name
  c['talent-materials'][materialIndex[id].name] = ['assignment', 'calyx'].includes(kind) ? [id - 2, id - 1, id].map(id => totals[id] || 0).join('/') : totals[id]
}
c['talent-materials'][materialIndex[241].name] = totals[241]
add(`character/${c.name}/data.json`, c)
insert('character/data.json', { 1511: Object.fromEntries(['id', 'key', 'name', 'star', 'elem', 'weapon', 'sp', 'talentId', 'talentCons', 'eta'].map(k => [k, c[k]])) })
for (const [file, res] of Object.entries({ face: 'avatarroundicon', preview: 'avatarshopicon', splash: 'avatardrawcard' })) image(`character/${c.name}/imgs/${file}.webp`, res + '/1511')
for (const [id, key] of Object.entries(skillKeys)) {
  const point = points.find(p => p.level_up_skill_id.includes(Number(id)))
  const icon = point?.icon || 'SkillIcon_1511_Passive.png'
  image(`character/${c.name}/imgs/talent-${key}.webp`, 'skillicons/' + icon.replace('.png', ''))
}

const weaponIndex = {}
for (const id of [22009, 23065]) {
  const w = raw('lightcone-' + id)
  const stats = w.stats.at(-1)
  const attrs = s => ({ atk: s.base_attack, hp: s.base_hp, def: s.base_defence })
  const grow = { atk: stats.base_attack_add, hp: stats.base_hp_add, def: stats.base_defence_add }
  const skill = w.refinements
  const levels = Object.values(skill.level)
  const tables = {}
  for (let i = 0; i < levels[0].param_list.length; i++) {
    const percent = new RegExp('#' + (i + 1) + '\\[(?:i|f1|f2)\\]%').test(skill.desc)
    tables[i + 1] = levels.map(l => round(l.param_list[i] * (percent ? 100 : 1)))
  }
  const data = { id: String(id), name: w.name, star: Number(w.rarity.at(-1)), desc: clean(w.desc).replace(/\n/g, '<br />'), type: '欢愉', typeId: 0,
    baseAttr: Object.fromEntries(Object.entries(attrs(stats)).map(([k, n]) => [k, round(n + grow[k] * 79)])), growAttr: grow,
    attr: Object.fromEntries(w.stats.map((s, i) => [i, { promote: i, maxLevel: s.max_level, cost: cost(s.promotion_cost_list), attrs: attrs(s) }])),
    skill: { id, name: skill.name, desc: clean(skill.desc).replace(/#(\d+)\[/g, '$$$1['), tables } }
  add(`weapon/欢愉/${w.name}/data.json`, data)
  weaponIndex[id] = { id, name: w.name, type: '欢愉', star: data.star }
  for (const [file, res] of Object.entries({ 'icon-s': 'lightconemediumicon', icon: 'lightconemediumicon', splash: 'lightconemediumicon' })) image(`weapon/欢愉/${w.name}/${file}.webp`, res + '/' + id)
}
insert('weapon/data.json', weaponIndex)
const relics = {}
for (const id of [329, 330]) {
  const r = raw('relicset-' + id)
  const data = { id: String(id), name: r.name, skills: {}, idxs: {} }
  for (const [n, s] of Object.entries(r.require_num)) data.skills[n] = fixed(s.desc, s.param_list)
  for (const [part, s] of Object.entries(r.parts)) {
    const idx = part.at(-1)
    data.idxs[idx] = { name: s.name, desc: clean(s.desc), lore: clean(s.story).replace(/\n/g, '<br />'), ids: Object.fromEntries([3, 4, 5, 6].map(n => [String(n) + part.slice(1), n - 1])) }
    image(`artifact/${r.name}/arti-${idx}.webp`, `relicfigures/IconRelic_${id}_${idx}`)
  }
  image(`artifact/${r.name}/arti-0.webp`, 'itemfigures/' + path.basename(r.icon, '.png'))
  relics[id] = data
}
insert('artifact/data.json', relics)
const material = raw('item_all')['110510']
insert('material/data.json', {
  110510: {
    id: material.id, name: material.item_name, type: 'weekly', star: 4,
    desc: clean(material.item_bg_desc).replace(/\n/g, '<br />'),
    source: material.item_comefrom.map(item => item.desc)
  }
})
image('material/weekly/饥饿的乳牙.webp', 'itemfigures/110510')
patches.push(`*** Add File: ${cache}assets.json\n` + JSON.stringify(assets, null, 2).split('\n').map(l => '+' + l).join('\n'))
console.log('*** Begin Patch\n' + patches.join('\n') + '\n*** End Patch')
