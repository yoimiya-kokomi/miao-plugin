import { Data, Meta } from '#miao'
import lodash from 'lodash'
import { abbr, aliasCfg } from './alias.js'

const types = '存护,丰饶,毁灭,同谐,虚无,巡猎,智识'.split(',')
let data = Data.readJSON('/resources/meta-sr/weapon/data.json', 'miao')

const meta = Meta.create('sr', 'weapon')
meta.addData(data)
meta.addAlias(aliasCfg)
meta.addAbbr(abbr)

const weaponBuffs = {}
let loadBuffs = async function () {
  for (let type of types) {
    let calc = await Data.importDefault(`/resources/meta-sr/weapon/${type}/calc.js`, 'miao')
    if (lodash.isFunction(calc)) {
      calc = calc((idx, key) => {
        return {
          isStatic: true,
          idx,
          key
        }
      }, (title, key, idx) => {
        if (lodash.isPlainObject(key)) {
          return (tables) => {
            let data = {}
            lodash.forEach(key, (idx, k) => {
              data[k] = tables[idx]
            })
            return {
              title,
              data
            }
          }
        } else {
          return {
            title,
            idx,
            key
          }
        }
      })
    }
    lodash.forEach(calc, (ds, key) => {
      let id = meta.getId(key)
      if (id) {
        weaponBuffs[id] = ds
      }
    })
  }
}
await loadBuffs()

meta.addMeta({ weaponBuffs })
