// node --experimental-vm-modules plugins/miao-plugin/tools/test-hsr-47-calc.mjs
// 使用实际面板、光锥、套装、天赋与伤害模块；隔离机器人启动和消息发送。
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

let lodash
try {
  lodash = (await import('lodash')).default
} catch (error) {
  if (error.code !== 'ERR_MODULE_NOT_FOUND' && error.code !== 'MODULE_NOT_FOUND') throw error
  // TRSS 的映射目录可能无法解析 node_modules 中的相对链接，回退到其源码入口。
  lodash = (await import('../../../lib/modules/lodash/index.js')).default
}

const root = new URL('../', import.meta.url)
const read = file => JSON.parse(fs.readFileSync(new URL(file, root), 'utf8'))
const context = vm.createContext({ console, setTimeout: (...args) => setTimeout(...args).unref(), clearTimeout })
const modules = new Map()
const meta = {}
function synthetic (id, exports) {
  const module = new vm.SyntheticModule(Object.keys(exports), function () {
    for (const [key, value] of Object.entries(exports)) this.setExport(key, value)
  }, { context, identifier: id })
  modules.set(id, module)
  return module
}
synthetic('lodash', { default: lodash })
synthetic('node:fs', { default: fs })
synthetic('fs', { default: fs })
synthetic('#miao', {
  Data: { readJSON: read, isPromise: v => v instanceof Promise }, Meta: meta,
  Format: { elemName: value => value, isElem: () => false, comma: n => String(n) },
  Common: { cfg: () => false }, MiaoError: Error
})
synthetic('#miao.path', { miaoPath: fileURLToPath(root) })
const models = synthetic('#miao.models', { Weapon: undefined, ArtifactSet: undefined, Artifact: {}, Character: {} })
async function moduleFor (specifier, parent = root.href) {
  if (modules.has(specifier)) return modules.get(specifier)
  const url = new URL(specifier, parent)
  if (url.href === new URL('models/index.js', root).href) return models
  if (!modules.has(url.href)) modules.set(url.href, new vm.SourceTextModule(fs.readFileSync(url, 'utf8'), { context, identifier: url.href }))
  return modules.get(url.href)
}
async function load (file) {
  const module = await moduleFor(new URL(file, root).href)
  if (module.status === 'unlinked') await module.link((specifier, parent) => moduleFor(specifier, parent.identifier))
  if (module.status !== 'evaluated') await module.evaluate()
  return module.namespace
}
Object.assign(meta, (await load('components/Meta.js')).default)
const Weapon = (await load('models/Weapon.js')).default
const ArtifactSet = (await load('models/ArtifactSet.js')).default
models.setExport('Weapon', Weapon)
models.setExport('ArtifactSet', ArtifactSet)
const Attr = (await load('models/attr/Attr.js')).default
const DmgBuffs = (await load('models/dmg/DmgBuffs.js')).default
const DmgAttr = (await load('models/dmg/DmgAttr.js')).default
const DmgCalc = (await load('models/dmg/DmgCalc.js')).default
const ProfileDmg = (await load('models/ProfileDmg.js')).default
const charRules = await load('resources/meta-sr/character/星神★阿哈/calc.js')
const artifactRules = (await load('resources/meta-sr/artifact/calc.js')).default
const weaponRules = (await load('resources/meta-sr/weapon/欢愉/calc.js')).default(
  (idx, key) => ({ isStatic: true, idx, key }),
  (title, key, idx) => ({ title, key, idx })
)
const weaponIndex = read('resources/meta-sr/weapon/data.json')
const charData = read('resources/meta-sr/character/星神★阿哈/data.json')
const weaponMeta = meta.create('sr', 'weapon')
weaponMeta.addData(weaponIndex)
weaponMeta.addMeta({ weaponBuffs: Object.fromEntries(Object.values(weaponIndex).filter(w => weaponRules[w.name]).map(w => [w.id, weaponRules[w.name]])) })
meta.create('sr', 'arti').addMeta({ artiBuffs: artifactRules, attrMap: {} })
const setMeta = meta.create('sr', 'artiSet')
for (const set of Object.values(read('resources/meta-sr/artifact/data.json'))) setMeta.addDataItem(set.name, set)

let checks = 0
function near (actual, expected, message) {
  assert(Number.isFinite(actual) && Math.abs(actual - expected) < 1e-7 * Math.max(1, Math.abs(expected)), `${message}: ${actual} != ${expected}`)
  checks++
}
function fixture ({ cons = 0, refine = 1, weaponId = 23065, set = '神的瞬息欢愉', speed = 40, params = {}, path = '欢愉', trees = true } = {}) {
  const char = { ...charData, detail: charData, game: 'sr', isSr: true, weapon: path, weaponTypeName: path, getLvAttr: () => charData.baseAttr }
  const weapon = { name: weaponIndex[weaponId].name, affix: refine, level: 80, promote: 6 }
  const artis = set ? { [set]: 2 } : {}
  Object.defineProperties(artis, {
    forEach: { value: fn => fn({ main: { key: 'speed', value: speed }, attrs: [] }) },
    eachArtisSet: { value: fn => { if (set) fn({ name: set }, 2) } }
  })
  const profile = { char, game: 'sr', level: 80, promote: 6, weapon, artis, trees: trees ? Object.keys(charData.treeData) : [], cons, talent: {} }
  for (const [key, max] of Object.entries({ a: 6, e: 10, q: 10, t: 10, xe: 10 })) {
    const upgrades = [].concat(charData.talentCons[key]).filter(c => cons >= c).length
    profile.talent[key] = max + upgrades * (key === 'a' || key === 'xe' ? 1 : 2)
  }
  const talent = ProfileDmg.prototype.talent.call({ char, profile, isSr: true })
  const original = Attr.create(profile).calc()
  const originalAttr = DmgAttr.getAttr({ attr: original, weapon, char, game: 'sr' })
  const metadata = { cons, talent, level: 80, characterName: char.name, trees: ProfileDmg.prototype.trees.call({ profile }) }
  const merged = { ...charRules.defParams, ...params }
  const buffs = DmgBuffs.getBuffs(profile, [...charRules.buffs], 'sr')
  const result = DmgAttr.calcAttr({ originalAttr, buffs, meta: metadata, artis, params: merged, game: 'sr' })
  const ds = DmgAttr.getDs(result.attr, metadata, merged)
  const dmg = DmgCalc.getDmgFn({ ds, attr: result.attr, level: 80, enemyLv: 95, game: 'sr' })
  return { ...result, ds, dmg, original, originalAttr, buffs, metadata, merged }
}

// 基础速度应被套装速度百分比放大，且不在战斗层重复添加。
for (let refine = 1; refine <= 5; refine++) {
  const f = fixture({ refine })
  near(f.original.speedBase, 94 + 10 + refine * 2, '光锥基础速度')
  near(f.original.speed, (94 + 10 + refine * 2) * 1.06 + 45, '基础速度乘套装百分比')
  near(f.ds.calc(f.attr.speed), f.original.speed, '战斗层不重复加速')
  near(f.attr.enemy.ignore, 30 + 14 + refine * 2, '光锥与零魂升格无视防御')
  near(fixture({ refine, params: { ahaLightconeSkillTriggered: false, ahaGlorious: false } }).attr.enemy.ignore, 0, '光锥未触发')
}
near(fixture({ path: '巡猎', params: { ahaGlorious: false } }).original.speedBase, 94, '不同命途无基础速度增益')
near(fixture({ path: '巡猎', params: { ahaGlorious: false } }).attr.enemy.ignore, 0, '不同命途无战技增益')

// 四星光锥按队伍人数与阿哈在场分别生效；默认只有装备者一名欢愉角色。
for (let refine = 1; refine <= 5; refine++) {
  for (let count = 1; count <= 4; count++) {
    const f = fixture({ weaponId: 22009, refine, params: { elationCount: count, ahaTalentBuff: false, ahaGlorious: false } })
    near(f.ds.calc(f.attr.cdmg) - f.original.cdmg, (5 + refine) * count + 10 + refine * 2, '四星光锥爆伤')
  }
}
const four = weaponRules['在世界尽头相会吧！'][1]({ 2: 12 })
assert.equal(four.check({ weaponTypeName: '欢愉', characterName: '爻光', params: {} }), false)
assert.equal(four.check({ weaponTypeName: '欢愉', characterName: '爻光', params: { ahaInTeam: true } }), true)
checks += 2

// 精确测试速度阈值前后；移除光锥与遗器以隔离行迹。
for (const [value, joy] of [[124.999, 0], [125, 120], [149.999, 120], [150, 150]]) {
  const f = fixture({ weaponId: 22009, set: '', speed: value - 99 })
  near(f.ds.calc(f.attr.joy), joy, '阿哈速度阈值')
}
near(fixture({ trees: false }).ds.calc(fixture({ trees: false }).attr.joy), 0, '行迹未解锁')
for (const [entrySpeed, stance] of [[144.999, 0], [145, 18]]) {
  near(fixture({ set: '亚空异容所', params: { entrySpeed } }).ds.calc(fixture({ set: '亚空异容所', params: { entrySpeed } }).attr.stance), stance, '亚空异容所进场门槛')
}
const noStack = fixture({ set: '亚空异容所', params: { entrySpeed: 160, subspaceBuffAlreadyApplied: true } })
near(noStack.ds.calc(noStack.attr.stance), 0, '亚空异容所不重复叠加')
const momentSet = artifactRules['神的瞬息欢愉'][2][1]
assert.equal(momentSet.check({ params: { entryJoy: 39.999 }, attr: {}, calc: () => 0 }), false)
assert.equal(momentSet.check({ params: { entryJoy: 40 }, attr: {}, calc: () => 0 }), true)
assert.equal(momentSet.data, undefined, '行动提前不能当成伤害乘区')
checks += 3

// 实际天赋读取、星魂升级、增笑、无视防御、笑点以及最终公式一起验证。
for (let cons = 0; cons <= 6; cons++) {
  for (const weaponId of [22009, 23065]) {
    const f = fixture({ cons, weaponId, params: { teammateBanger: 80 } })
    near(f.attr.punchline, cons >= 4 ? 180 : 100, '四魂额外笑点只计一次')
    near(f.attr.merrymakes, cons >= 1 ? 15 : 0, '一魂增笑')
    near(f.ds.calc(f.attr.cpct) - f.original.cpct, cons >= 2 ? 20 : 12, '二魂替换暴击率')
    near(f.ds.talent.a['欢愉伤害'], cons >= 3 ? 0.55 : 0.5, '三魂普攻等级')
    near(f.ds.talent.xe['欢愉伤害'], cons >= 5 ? 0.66 : cons >= 3 ? 0.63 : 0.6, '三五魂欢愉技等级')
    const hit = f.dmg(f.ds.talent.xe['欢愉伤害'], 'xe', 'elation')
    const joyMultiplier = f.original.speed >= 150 ? 2.5 : f.original.speed >= 125 ? 2.2 : 1
    const expected = 7535.11 * f.ds.talent.xe['欢愉伤害'] * (1 + f.attr.merrymakes / 100) * joyMultiplier * (1 + f.attr.punchline * 5 / (f.attr.punchline + 240)) * (1 + f.ds.calc(f.attr.cdmg) / 100) * 1000 / (1000 + 1150 * (1 - Math.min(1, f.attr.enemy.ignore / 100))) * 0.9
    near(hit.dmg, expected, '欢愉伤害完整公式')
    const full = charRules.momentDamage(f.ds, f.dmg)
    near(full.dmg, hit.dmg * (cons >= 4 ? 1.25 : 1.2), '真实伤害仅结算一次')
    for (const detail of charRules.details.slice(0, 6)) {
      const params = { ...f.merged, ...detail.params }
      const { attr } = DmgAttr.calcAttr({ originalAttr: f.originalAttr, buffs: f.buffs, meta: f.metadata, params, game: 'sr' })
      const ds = DmgAttr.getDs(attr, f.metadata, params)
      const dmg = DmgCalc.getDmgFn({ ds, attr, level: 80, enemyLv: 95, game: 'sr' })
      const result = detail.dmg(ds, dmg)
      assert(Number.isFinite(result.avg) && result.avg > 0)
      checks++
    }
  }
}
const f = fixture({ cons: 4, params: { enemyCount: 5, ahaMomentDamage: 100000, ahaMomentAvgDamage: 50000 } })
const hit = f.dmg(f.ds.talent.xe['欢愉伤害'], 'xe', 'elation')
const full = charRules.momentDamage(f.ds, f.dmg)
near(full.dmg, hit.dmg * 1.25 + 5000, '队友真实伤害按目标数均分')
near(full.avg, hit.avg * 1.25 + 2500, '期望伤害独立结算')
near(charRules.debtState({ cons: 0, params: { enemyMaxHp: 100000, enemyHitHpLoss: 10000, enemyHpAfterHit: 90000 } }).hpLoss, 0, '负债占上限但不重叠当前生命')
near(charRules.debtState({ cons: 0, params: { enemyMaxHp: 100000, enemyHitHpLoss: 100000, enemyHpAfterHit: 95000 } }).occupied, 10000, '普通负债上限')
near(charRules.debtState({ cons: 6, params: { enemyMaxHp: 100000, enemyHpAfterHit: 100000 } }).hpLoss, 20000, '六魂负债下限')
near(charRules.debtState({ cons: 6, params: { enemyMaxHp: 100000, enemyHpAfterHit: 80000, ahaPreviousDebt: 20000 } }).hpLoss, 0, '六魂不重复扣血')
console.log(JSON.stringify({ checks, result: '通过', modules: ['Attr', 'Weapon', 'ArtifactSet', 'ProfileDmg.talent', 'DmgBuffs', 'DmgAttr', 'DmgCalc'] }, null, 2))
