import { Data } from '#miao'
import lodash from 'lodash'

let data = Data.readJSON('/resources/meta-sr/artifact/data.json', 'miao')
let meta = Data.readJSON('/resources/meta-sr/artifact/meta.json', 'miao')

let artiMap = {}
let idMap = {}
lodash.forEach(data, (setData) => {
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
  })
})
export const metaData = meta
export { artiMap, idMap }