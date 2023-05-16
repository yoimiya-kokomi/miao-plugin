import { Data } from '#miao'
import lodash from 'lodash'
import calc from './calc.js'

let artiSetMap = {}
let artiMap = {}

let artis = Data.readJSON('resources/meta/artifact/data.json', 'miao')

lodash.forEach(artis, (ds) => {
  let artiSet = {
    name: ds.name,
    effect: ds.effect,
    sets: {}
  }
  artiSetMap[ds.name] = artiSet
  lodash.forEach(ds.sets, (as, idx) => {
    if (as.name) {
      artiMap[as.name] = {
        set: ds.name,
        name: as.name,
        idx
      }
      artiSet.sets[idx] = as.name
    }
  })
})

export { artiMap, artiSetMap, calc }
export * from './meta.js'
