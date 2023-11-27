/**
 * 角色别名及角色ID相关
 * */
import lodash from 'lodash'
import { Data, Format, Meta } from '#miao'

async function init () {
  let { diyCfg } = await Data.importCfg('character')
  let meta = Meta.create('gs', 'char')
  let customChars = {}
  let customAlias = {}
  lodash.forEach(diyCfg.customCharacters, (alias, id) => {
    let charId = meta.getId(id)
    if (!charId) {
      customChars[id] = {
        id,
        name: alias[0]
      }
    }
    customAlias[id] = alias.join(',')
  })
  meta.addData(customChars)
  meta.addAlias(customAlias)
}

await init()

const CharId = {

  getId (ds = '', game = '', elem = '') {
    if (!ds) {
      return false
    }
    if (lodash.isObject(ds)) {
      let em = Format.elem(ds.elem || ds.element)
      for (let key of ['id', 'name']) {
        if (!ds[key]) continue
        let ret = CharId.getId(ds[key], game, em || '')
        if (ret) return ret
      }
      return false
    }

    const ret = (data, game = 'gs', em = '') => {
      let { id, name } = data
      return { id, data, name, game, elem: em || elem }
    }

    let match = Meta.matchGame(game, 'char', ds)
    if (match) {
      return ret(match.data, match.game)
    }
    if (game !== 'sr') {
      // 尝试使用元素起始匹配
      let em = Format.matchElem(ds, '', true)
      if (em) {
        let match = Meta.getData('gs', 'char', em.name)
        if (match && CharId.isTraveler(match.id)) {
          return ret(match.data, 'gs', em.elem)
        }
      }
    }
    // 无匹配结果
    return false
  },

  getRandomId (game = 'gs') {
    let meta = Meta.create(game, 'char')
    let ids = meta.getIds()
    if (game === 'gs') {
      ids = lodash.filter(ids, (id) => /^\d+$/.test(id))
    }
    return lodash.sample(ids)
  },

  isTraveler (id) {
    if (id) {
      return [10000007, 10000005, 20000000].includes(id * 1)
    }
    return false
  }

}
export default CharId
