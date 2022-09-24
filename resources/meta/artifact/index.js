import { Data } from '../../../components/index.js'
import lodash from 'lodash'
import { abbr, attrMap } from './meta.js'

let artiSetMap = {}
let artiMap = {}

let artis = Data.readJSON('resources/meta/artifact/data.json')

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
        idx
      }
      artiSet.sets[idx] = as.name
    }
  })
})

export { abbr, artiMap, artiSetMap, attrMap }
