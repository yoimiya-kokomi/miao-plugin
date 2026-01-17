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
      let { holdingRate, rate, avgLevel, avgCons } = consData
      rate = lodash.sortBy(rate, 'id')
      holding.num = Format.percent(holdingRate)
	    holding.avgLevel = avgLevel ? Number(avgLevel).toFixed(1) : "0.0"
      holding.avgCons = avgCons ? Number(avgCons).toFixed(2) : "0.00"
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
      weapons: CharWikiData.getWeaponsData(ud.weapon),
      artis: CharWikiData.getArtisData(ud.artifacts_set)
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
      let weapon = Weapon.get(ds.name) || {}
      weapons.push({
        ...weapon.getData('name,abbr,img,star'),
        value: ds.rate / 100
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
      let sets = ds.name.split("+")
      
      lodash.forEach(sets, (t) => {
        let ret = /(.*?)(4|2)$/.exec(t)
        if (ret) {
          let name = ret[1]
          let count = ret[2]
          let artiSet = ArtifactSet.get(name)
          if (artiSet) {
            imgs.push(artiSet.img)
            abbrs.push(artiSet.abbr + count)
          }
        } else {
           // 处理"暂无套装"等情况
           if (t === "暂无套装") {
             abbrs.push("其它")
           }
        }
      })

      if (abbrs.length > 0) {
        artis.push({
          imgs,
          title: abbrs.join("+"),
          value: ds.rate / 100
        })
      }
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
