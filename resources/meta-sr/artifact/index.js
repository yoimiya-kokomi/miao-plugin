import { Data, Meta } from '#miao'
import lodash from 'lodash'
import artiBuffs from './calc.js'
import { mainAttr, subAttr, attrMap } from './meta.js'
import { artiSetAbbr, aliasCfg, artiAbbr } from './alias.js'

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
    idxs: {}
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
    artiSet.idxs[idx] = ds.name
  })
})

setMeta.addAbbr(artiSetAbbr)
setMeta.addAlias(aliasCfg)

artiMeta.addAbbr(artiAbbr)
artiMeta.addAlias(idMap, true)
artiMeta.addMeta({
  artiBuffs, metaData, usefulAttr, mainAttr, subAttr, attrMap
})
