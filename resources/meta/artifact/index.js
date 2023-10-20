import { Data, Meta } from '#miao'
import lodash from 'lodash'
import calc from './calc.js'
import * as metaData from './meta.js'

let artiSetMap = {}
let artiMap = {}

let setMeta = Meta.getMeta('gs', 'artiSet')
let artiMeta = Meta.getMeta('gs', 'artis')

let artis = Data.readJSON('resources/meta/artifact/data.json', 'miao')

lodash.forEach(artis, (ds) => {
  let artiSet = {
    name: ds.name,
    effect: ds.effect,
    sets: {}
  }
  artiSetMap[ds.name] = artiSet
  setMeta.addDataItem(ds.name, artiSet)

  lodash.forEach(ds.sets, (as, idx) => {
    if (as.name) {
      let tmp = {
        set: ds.name,
        name: as.name,
        idx
      }
      artiMap[as.name] = tmp
      artiSet.sets[idx] = as.name
      artiMeta.addDataItem(as.name, tmp)
    }
  })
})

export { artiMap, artiSetMap, calc }
export * from './meta.js'

setMeta.addAbbr(metaData.abbr)
setMeta.addAlias(metaData.aliasCfg)
artiMeta.addCfg({
  ...Data.getData(metaData, 'mainAttr,subAttr,attrMap,attrNameMap,mainIdMap,attrIdMap'),
  calc
})
export default artiMeta
