import { Data, Meta } from '#miao'
import { alias } from './meta.js'

let data = Data.readJSON('resources/meta-sr/character/data.json', 'miao')
let meta = Meta.getMeta('sr', 'char')
meta.addData(data)
meta.addAlias(alias)
