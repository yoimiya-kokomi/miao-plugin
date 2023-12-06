import { Data, Meta } from '#miao'
import lodash from 'lodash'
import { abbr } from './abbr.js'
import dailyData from './daily.js'

let data = Data.readJSON('resources/meta-gs/material/data.json', 'miao')

let ret = {}
let abbr2 = {}

let citys = ['蒙德', '璃月', '稻妻', '须弥', '枫丹']

lodash.forEach(data, (ds) => {
  let { type, name } = ds
  let tmp = {
    name,
    type,
    star: ds.star
  }

  if (type === 'talent' || type === 'weapon') {
    tmp.abbr = (ds.type === 'talent' ? Data.regRet(/「(.+)」/, name, 1) : name.slice(0, 4)) || name
    abbr2[name] = tmp.abbr
    lodash.forEach(dailyData[type], (weekData, week) => {
      let cid = weekData.indexOf(tmp.abbr)
      if (cid !== -1) {
        tmp.week = week * 1
        tmp.city = citys[cid]
        tmp.cid = cid + 1
        return false
      }
    })
  }

  if (ds.items) {
    tmp.items = {}
    lodash.forEach(ds.items, (item) => {
      tmp.items[item.star] = item.name
      ret[item.name] = {
        name: item.name,
        type: item.type,
        star: item.star
      }
    })
  }
  ret[ds.name] = tmp
})

let meta = Meta.create('gs', 'material')
meta.addData(ret)
meta.addAbbr(abbr)
meta.addAbbr(abbr2)
meta.addMeta({ dailyData })
