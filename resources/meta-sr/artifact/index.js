import { Data, Meta } from '#miao'
import lodash from 'lodash'
import artisBuffs from './calc.js'
import * as metaCfg from './meta.js'

let data = Data.readJSON('/resources/meta-sr/artifact/data.json', 'miao')
let meta = Data.readJSON('/resources/meta-sr/artifact/meta.json', 'miao')

let setMeta = Meta.getMeta('sr', 'artiSet')
let artiMeta = Meta.getMeta('sr', 'artis')

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
  setMeta.addDataItem(artiSet.name, artiSet)

  lodash.forEach(setData.idxs, (ds, idx) => {
    artiMap[ds.name] = {
      ...ds,
      set: setData.name,
      setId: setData.id,
      idx
    }
    artiMeta.addDataItem(ds.name, ds)

    idMap[ds.name] = artiMap[ds.name]
    lodash.forEach(ds.ids, (star, id) => {
      idMap[id] = artiMap[ds.name]
    })
    artiSet.sets[idx] = ds.name
  })
})

arti

artiMeta.addCfg({
  idMap
})

export const metaData = meta
export { artiMap, idMap, artisBuffs, artiSetMap }
export * from './meta.js'
