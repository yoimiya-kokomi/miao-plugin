import { Data, Meta } from '#miao'
import lodash from 'lodash'
import { abbr, alias } from './alias.js'
import { weaponType, weaponSet } from './extra.js'
import { descFix } from './desc.js'

let weaponBuffs = {}
let data = {}

const step = function (start, step = 0) {
  if (!step) {
    step = start / 4
  }
  let ret = []
  for (let idx = 0; idx <= 5; idx++) {
    ret.push(start + step * idx)
  }
  return ret
}

const attr = function (key, start, _step) {
  let refine = {}
  refine[key] = step(start, _step)
  return {
    title: `${key}提高[key]`,
    isStatic: true,
    refine
  }
}

for (let type in weaponType) {
  // calc
  let typeCalc = await Data.importDefault(`resources/meta-gs/weapon/${type}/calc.js`, 'miao')
  let typeRet = typeCalc(step, attr)
  weaponBuffs = lodash.extend(weaponBuffs, typeRet)

  // data
  let typeData = await Data.readJSON(`resources/meta-gs/weapon/${type}/data.json`, 'miao')
  lodash.forEach(typeData, (ds) => {
    data[ds.id] = {
      id: ds.id,
      name: ds.name,
      type,
      star: ds.star
    }
  })
}

let meta = Meta.create('gs', 'weapon')
meta.addData(data)
meta.addAlias(alias)
meta.addAbbr(abbr)
meta.addMeta({
  weaponType, weaponSet, weaponBuffs, descFix
})
