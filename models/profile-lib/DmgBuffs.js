/*
* 伤害计算 - Buff计算
* */
import lodash from 'lodash'
import { Data } from '../../components/index.js'
import { ArtifactSet } from '../index.js'

let weaponBuffs = {}
let artisBuffs = {}

// lazy load
setTimeout(async function init () {
  weaponBuffs = (await Data.importModule('resources/meta/weapon/index.js')).calc || {}
  artisBuffs = (await Data.importModule('resources/meta/artifact/index.js')).calc || {}
})

let DmgBuffs = {
  // 圣遗物Buff
  getArtisBuffs (artis = {}) {
    if (!artis) {
      return []
    }
    let buffs = artisBuffs
    let retBuffs = []
    let addBuff = function (buff, name, num) {
      if (buff && !buff.isStatic) {
        let artiSet = ArtifactSet.get(name)
        retBuffs.push({
          ...buff,
          title: `${artiSet ? artiSet.abbr : name}${num}：` + buff.title
        })
      }
    }
    lodash.forEach(artis, (v, k) => {
      let aBuff = buffs[k] || {}
      addBuff(aBuff[v], k, v)
      if (v >= 4 && buffs[k + '2']) {
        addBuff(aBuff['2'], k, 2)
      }
    })
    return retBuffs
  },

  // 武器Buff
  getWeaponBuffs (weaponName) {
    let weaponCfg = weaponBuffs[weaponName] || []
    if (lodash.isPlainObject(weaponCfg)) {
      weaponCfg = [weaponCfg]
    }
    lodash.forEach(weaponCfg, (ds) => {
      if (!/：/.test(ds.title)) {
        ds.title = `${weaponName}：${ds.title}`
      }
      if (ds.refine) {
        ds.data = ds.data || {}
        lodash.forEach(ds.refine, (r, key) => {
          ds.data[key] = ({ refine }) => r[refine] * (ds.buffCount || 1)
        })
      }
    })
    return weaponCfg
  },

  getBuffs (profile, buffs = []) {
    let weaponBuffs = DmgBuffs.getWeaponBuffs(profile.weapon?.name || '')
    let artisBuffs = DmgBuffs.getArtisBuffs(profile.artis)
    buffs = lodash.concat(buffs, weaponBuffs, artisBuffs)
    let mKey = {
      vaporize: '蒸发',
      melt: '融化',
      swirl: '扩散'
    }
    lodash.forEach(buffs, (buff, idx) => {
      if (lodash.isString(buff) && mKey[buff]) {
        buff = {
          title: `元素精通：${mKey[buff]}伤害提高[${buff}]%`,
          mastery: buff
        }
        buffs[idx] = buff
      }
      buff.sort = lodash.isUndefined(buff.sort) ? 1 : buff.sort
    })
    buffs = lodash.sortBy(buffs, ['sort'])
    return buffs
  }
}
export default DmgBuffs
