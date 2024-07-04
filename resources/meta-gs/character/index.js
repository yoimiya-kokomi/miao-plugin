import lodash from 'lodash'
import { Data, Meta } from '#miao'
import { alias } from './alias.js'
import { extraChars, wifeCfg } from './extra.js'

let data = Data.readJSON('resources/meta-gs/character/data.json', 'miao')
let meta = Meta.create('gs', 'char')

meta.addData(data)
meta.addAlias(alias)

// 导入主角天赋对应元素，以据此判断主角元素
let travelers = ["荧", "空", "旅行者"]
travelers.forEach(name => {
  meta.addDataItem(
    meta.getId(name),
    Data.readJSON(`resources/meta-gs/character/${name}/data.json`, 'miao')
  )
})

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
let { diyCfg } = await Data.importCfg('character')
let diyWifeData = diyCfg.wifeData || {}
lodash.forEach(wifeCfg, (txt, type) => {
  wifeData[type] = wifeData[type] || {}
  Data.eachStr(txt, (name) => {
    let id = meta.getId(name)
    if (id) {
      wifeData[type][id] = true
    }
  })
})
lodash.forEach(diyWifeData, (txt, type) => {
  wifeData[type] = wifeData[type] || {}
  Data.eachStr(txt, (name) => {
    let id = meta.getId(name)
    if (id) {
      wifeData[type][id] = true
    }
  })
})
meta.addMeta({ wifeData })
