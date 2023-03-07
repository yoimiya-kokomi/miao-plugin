import { Data } from '#miao'
import lodash from 'lodash'
import { weaponType, abbr, alias, weaponSet } from './meta.js'

let calc = {}
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
  let typeCalc = await Data.importDefault(`resources/meta/weapon/${type}/calc.js`, 'miao')
  let typeRet = typeCalc(step, attr)
  calc = lodash.extend(calc, typeRet)

  // data
  let typeData = await Data.readJSON(`resources/meta/weapon/${type}/data.json`,'miao')
  lodash.forEach(typeData, (ds) => {
    data[ds.name] = {
      id: ds.id,
      name: ds.name,
      type,
      star: ds.star
    }
  })
}

let aliasMap = {}
lodash.forEach(alias, (txt, name) => {
  Data.eachStr(txt, (t) => {
    aliasMap[t] = name
    aliasMap[name] = name
  })
})
lodash.forEach(abbr, (a, name) => {
  aliasMap[a] = name
})
lodash.forEach(data, (ds, name) => {
  aliasMap[name] = name
  aliasMap[ds.id] = name
})

export const weaponBuffs = calc
export const weaponData = data
export const weaponAbbr = abbr
export const weaponAlias = aliasMap
export { weaponType, weaponSet }
