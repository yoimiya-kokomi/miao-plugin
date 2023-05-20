import { Data } from '#miao'
import lodash from 'lodash'
import artisBuffs from './calc.js'

let data = Data.readJSON('/resources/meta-sr/artifact/data.json', 'miao')
let meta = Data.readJSON('/resources/meta-sr/artifact/meta.json', 'miao')

let artiMap = {}
let idMap = {}
let artiSetMap = {}
lodash.forEach(data, (setData) => {
  let artiSet = {
    name: setData.name,
    effect: setData.skill,
    sets: {}
  }
  artiSetMap[setData.name] = artiSet

  lodash.forEach(setData.idxs, (ds, idx) => {
    artiMap[ds.name] = {
      ...ds,
      set: setData.name,
      setId: setData.id,
      idx
    }
    idMap[ds.name] = artiMap[ds.name]
    lodash.forEach(ds.ids, (star, id) => {
      idMap[id] = artiMap[ds.name]
    })
    artiSet.sets[idx] = ds.name
  })
})
export const metaData = meta
export { artiMap, idMap, artisBuffs, artiSetMap }