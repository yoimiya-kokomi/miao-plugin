import assert from 'node:assert/strict'
import fs from 'node:fs'
import { alias } from '../resources/meta-sr/character/alias.js'

const root = new URL('../resources/meta-sr/', import.meta.url)
const read = file => JSON.parse(fs.readFileSync(new URL(file, root), 'utf8'))
const char = read('character/星神★阿哈/data.json')
const index = read('character/data.json')
assert.equal(index[1511].name, char.name)
assert.deepEqual(index[1511].talentId, char.talentId)
assert.deepEqual(index[1511].talentCons, char.talentCons)
const aliases = {}
for (const [name, value] of Object.entries(alias)) {
  for (const word of value.split(',')) aliases[word.trim().toLowerCase()] = name
}
for (const word of ['星神阿哈', '星神·阿哈', '啊哈', '阿哈', '虚照', '马老师']) assert.equal(aliases[word], char.name)
assert.equal(Object.keys(alias).at(-1), char.name)
for (const [file, id] of [['character/data.json', 1511], ['weapon/data.json', 22009], ['weapon/data.json', 23065], ['artifact/data.json', 329], ['artifact/data.json', 330]]) {
  const text = fs.readFileSync(new URL(file, root), 'utf8')
  const ids = [...text.matchAll(/^  "(\d+)":/gm)].map(m => Number(m[1]))
  assert.equal(ids.filter(n => n === id).length, 1)
  const pos = ids.indexOf(id)
  if (pos > 0) assert(ids[pos - 1] < id)
  if (pos + 1 < ids.length) assert(ids[pos + 1] > id)
}
const data = [char, read('weapon/欢愉/在世界尽头相会吧！/data.json'), read('weapon/欢愉/当第一声「阿哈」响起/data.json')]
for (const d of data) {
  const stages = Object.values(d.attr)
  assert.equal(stages.length, 7)
  for (const key of ['hp', 'atk', 'def']) assert(Math.abs(d.baseAttr[key] - stages[6].attrs[key] - 79 * d.growAttr[key]) < 1e-6)
}
const mats = read('material/data.json')
for (const stage of char.attr) for (const id of Object.keys(stage.cost)) assert(mats[id], `缺少素材 ${id}`)
for (const tree of Object.values(char.treeData)) for (const id of Object.keys(tree.cost)) assert(mats[id], `缺少行迹素材 ${id}`)
for (const tree of Object.values(char.tree)) assert(Number.isFinite(tree.value))
for (const t of Object.values(char.talent)) {
  for (const match of t.desc.matchAll(/\$(\d+)\[/g)) assert(t.tables[match[1]], `缺少技能参数 ${t.name}`)
  for (const table of Object.values(t.tables)) assert(table.values.every(Number.isFinite))
}
assert(!JSON.stringify(char).includes('#{'))
assert(!JSON.stringify(char).match(/#\d+\[(i|f1|f2)\]/))
const sourceDir = new URL('../../../temp/nanoka-hsr-4.7/', import.meta.url)
const source = JSON.parse(fs.readFileSync(new URL('character-1511.json', sourceDir), 'utf8'))
let parameters = 0
for (const [key, t] of Object.entries(char.talent)) {
  const s = source.skills[t.id]
  assert(s)
  for (const [idx, table] of Object.entries(t.tables)) {
    const expected = Object.values(s.level).map(l => l.param_list[Number(idx) - 1])
    assert.deepEqual(table.values, key === 't2' ? expected.slice(0, 1) : expected)
    parameters += table.values.length
  }
}
const imageDirs = ['character/星神★阿哈/imgs/', 'weapon/欢愉/在世界尽头相会吧！/', 'weapon/欢愉/当第一声「阿哈」响起/', 'artifact/神的瞬息欢愉/', 'artifact/亚空异容所/']
const images = imageDirs.flatMap(dir => fs.readdirSync(new URL(dir, root)).filter(f => f.endsWith('.webp')).map(f => dir + f))
images.push('material/weekly/饥饿的乳牙.webp')
assert.equal(images.length, 34)
for (const file of images) {
  const buffer = fs.readFileSync(new URL(file, root))
  assert.equal(buffer.toString('ascii', 0, 4), 'RIFF', file)
  assert.equal(buffer.toString('ascii', 8, 12), 'WEBP', file)
  assert.equal(buffer.readUInt32LE(4) + 8, buffer.length, file)
}
console.log(JSON.stringify({ character: char.name, aliases: 6, skillParameters: parameters, traces: Object.keys(char.treeData).length, eidolons: Object.keys(char.cons).length, lightcones: 2, relicSets: 2, images: images.length, result: '通过' }, null, 2))
