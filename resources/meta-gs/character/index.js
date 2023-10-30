import lodash from 'lodash'
import { Data, Meta } from '#miao'
import { alias } from './alias.js'
import { extraChars, wifeCfg } from './extra.js'

let data = Data.readJSON('resources/meta-gs/character/data.json', 'miao')
let meta = Meta.create('gs', 'char')

meta.addData(data)
meta.addAlias(alias)

// 添加自定义角色
lodash.forEach(extraChars, (alias, char) => {
  meta.addDataItem(char, {
    id: char,
    name: char
  })
})
// 添加自定义角色别名
meta.addAlias(extraChars)

// 添加老婆设置
let wifeData = {}
lodash.forEach(wifeCfg, (txt, type) => {
  wifeData[type] = wifeData[type] || {}
  Data.eachStr(txt, (name) => {
    let id = meta.getId(name)
    if (id) {
      wifeData[type][id] = true
    }
  })
})
meta.addMeta({ wifeData })
