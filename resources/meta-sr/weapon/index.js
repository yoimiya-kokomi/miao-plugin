import { Data } from '#miao'
import lodash from 'lodash'

let data = Data.readJSON('/resources/meta-sr/weapon/data.json', 'miao')
let aliasMap = {}

lodash.forEach(data, (ds) => {
  aliasMap[ds.id] = ds.id
  aliasMap[ds.name] = ds.id
})

export const weaponAlias = aliasMap
export const weaponData = data