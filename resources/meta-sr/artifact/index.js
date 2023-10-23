import { Data, Meta } from '#miao'
import lodash from 'lodash'
import artiBuffs from './calc.js'
import * as metaCfg from './meta.js'

import { usefulAttr } from './artis-mark.js'

let data = Data.readJSON('/resources/meta-sr/artifact/data.json', 'miao')
let metaData = Data.readJSON('/resources/meta-sr/artifact/meta.json', 'miao')

let setMeta = Meta.create('sr', 'artiSet')
let artiMeta = Meta.create('sr', 'arti')

let idMap = {}
lodash.forEach(data, (setData) => {
  let artiSet = {
    name: setData.name,
    effect: setData.skill,
    sets: {}
  }
  setMeta.addDataItem(artiSet.name, artiSet)

  lodash.forEach(setData.idxs, (ds, idx) => {
    artiMeta.addDataItem(ds.name, {
      ...ds,
      set: setData.name,
      setId: setData.id,
      idx
    })
    idMap[ds.name] = lodash.keys(ds.ids).join(',')
    artiSet.sets[idx] = ds.name
  })
})

setMeta.addAbbr(metaCfg.artiSetAbbr)
setMeta.addAlias(metaCfg.aliasCfg)

artiMeta.addAbbr(metaCfg.artiAbbr)
artiMeta.addAlias(idMap, true)
artiMeta.addMeta({
  artiBuffs,
  metaData,
  usefulAttr,
  ...Data.getData(metaCfg, 'mainAttr,subAttr,attrMap')
})
