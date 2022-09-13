/*
* 伤害计算 - Buff计算
* */
import lodash from 'lodash'

let weaponBuffs = {}
let artisBuffs = {}

let DmgBuffs = {
  // 圣遗物Buff
  getArtisBuffs (artis = {}) {
    if (!artis) {
      return []
    }
    let buffs = artisBuffs
    let retBuffs = []
    lodash.forEach(artis, (v, k) => {
      if (buffs[k + v]) {
        retBuffs.push(buffs[k + v])
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
      zf: '蒸发',
      rh: '融化',
      ks: '扩散'
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

async function init () {
  const _path = `file://${process.cwd()}/plugins/miao-plugin/resources/meta`
  weaponBuffs = (await import(`${_path}/weapons/calc.js`)).weapons || {}
  artisBuffs = (await import(`${_path}/reliquaries/calc.js`)).buffs || {}
}

await init()
export default DmgBuffs
