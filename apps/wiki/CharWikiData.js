import HutaoApi from '../stat/HutaoApi.js'
import lodash from 'lodash'
import { Format } from '#miao'
import { ArtifactSet, Weapon } from '#miao.models'

let CharWikiData = {
  /**
   * 角色命座持有
   * @param id
   * @returns {Promise<{}>}
   */
  async getHolding (id) {
    let consData = (await HutaoApi.getCons()).data || {}
    consData = lodash.find(consData, (ds) => ds.avatar === id)
    let holding = {}
    if (consData) {
      let { holdingRate, rate } = consData
      rate = lodash.sortBy(rate, 'id')
      holding.num = Format.percent(holdingRate)
      holding.cons = []
      lodash.forEach(rate, (ds) => {
        holding.cons.push({
          cons: ds.id,
          num: Format.percent(ds.value)
        })
      })
    }
    return holding
  },

  /**
   * 角色武器、圣遗物使用
   * @param id
   * @returns {Promise<{}|{artis: *[], weapons: *[]}>}
   */
  async getUsage (id) {
    let ud = (await HutaoApi.getUsage()).data || {}
    if (!ud[id]) {
      return {}
    }
    ud = ud[id]
    return {
      weapons: CharWikiData.getWeaponsData(ud.weapons),
      artis: CharWikiData.getArtisData(ud.artis)
    }
  },

  /**
   * 武器使用
   * @param data
   * @returns {*[]}
   */
  getWeaponsData (data = []) {
    let weapons = []

    lodash.forEach(data, (ds) => {
      let weapon = Weapon.get(ds.item) || {}
      weapons.push({
        ...weapon.getData('name,abbr,img,star'),
        value: ds.rate
      })
    })

    weapons = lodash.sortBy(weapons, 'value')
    weapons = weapons.reverse()
    lodash.forEach(weapons, (ds) => {
      ds.value = Format.percent(ds.value, 1)
    })
    return weapons
  },

  /**
   * 圣遗物使用
   * @param data
   * @returns {*[]}
   */
  getArtisData (data = []) {
    let artis = []

    lodash.forEach(data, (ds) => {
      let imgs = []
      let abbrs = []
      let ss = ds.item.split(',')
      lodash.forEach(ss, (t) => {
        t = t.split(':')
        let artiSet = ArtifactSet.get(t[0])
        if (artiSet) {
          imgs.push(artiSet.img)
          abbrs.push(artiSet.abbr + (ss.length === 1 ? t[1] : ''))
        }
      })

      artis.push({
        imgs,
        title: abbrs.join('+'),
        value: ds.rate
      })
    })

    artis = lodash.sortBy(artis, 'value')
    artis = artis.reverse()
    artis.forEach((ds) => {
      ds.value = Format.percent(ds.value)
    })
    return artis
  }
}
export default CharWikiData
