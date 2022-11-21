import { Data } from '../../../components/index.js'
import lodash from 'lodash'
import { weaponType, abbr } from './meta.js'

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
  let typeCalc = await Data.importDefault(`resources/meta/weapon/${type}/calc.js`)
  let typeRet = typeCalc(step, attr)
  calc = lodash.extend(calc, typeRet)

  // data
  let typeData = await Data.readJSON(`resources/meta/weapon/${type}/data.json`)
  lodash.forEach(typeData, (ds) => {
    data[ds.name] = {
      name: ds.name,
      type,
      star: ds.star
    }
  })
}

export { abbr, weaponType, calc, data }
