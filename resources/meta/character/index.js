import { Data, Meta } from '#miao'

import { alias } from './meta.js'

let data = Data.readJSON('resources/meta/character/data.json', 'miao')
let meta = Meta.getMeta('gs', 'char')
meta.addData(data)
meta.addAlias(alias)
