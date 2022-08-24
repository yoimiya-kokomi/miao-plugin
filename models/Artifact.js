import { attrMap } from '../resources/meta/reliquaries/artis-mark.js'
import lodash from 'lodash'
import { Data } from '../components/index.js'

let artisMap = {}

async function init () {
  let _path = process.cwd()
  let artis = Data.readJSON(`${_path}/plugins/miao-plugin/resources/meta/reliquaries/`, 'data.json') || {}

  lodash.forEach(artis, (ds) => {
    artisMap[ds.name] = ds
  })
}

await init()

let Artifact = {

  // 根据圣遗物名称获取套装
  getSetByArti (name) {
    for (let idx in artisMap) {
      for (let idx2 in artisMap[idx].sets) {
        if (artisMap[idx].sets[idx2].name === name) {
          return artisMap[idx]
        }
      }
    }
    return false
  },

  // 获取指定圣遗物套装指定位置的名字
  getArtiBySet (name, idx = 1) {
    let set = artisMap[name]
    if (!set) {
      return ''
    }
    return set.sets[`arti${idx}`].name
  },

  getMeta () {
    return {
      attrMap
    }
  }
}
export default Artifact
