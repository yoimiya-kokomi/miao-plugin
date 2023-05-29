/*
* 伤害计算 - Buff计算
* */
import lodash from 'lodash'
import { ProfileArtis, ArtifactSet, Weapon } from '../index.js'

let DmgBuffs = {
  getBuffs (profile, buffs = [], game = 'gs') {
    let weaponBuffs = DmgBuffs.getWeaponBuffs(profile.weapon, game)
    let artisBuffs = DmgBuffs.getArtisBuffs(profile.artis, game)
    buffs = lodash.concat(buffs, weaponBuffs, artisBuffs)
    let mKey = {
      vaporize: '蒸发',
      melt: '融化',
      swirl: '扩散'
    }
    let mKey2 = {
      aggravate: '超激化'
    }
    buffs = lodash.filter(buffs, (b) => !!b)
    lodash.forEach(buffs, (buff, idx) => {
      if (lodash.isString(buff)) {
        if (mKey[buff]) {
          buff = {
            title: `元素精通：${mKey[buff]}伤害提高[_${buff}]%`,
            mastery: buff
          }
          buffs[idx] = buff
        } else if (mKey2[buff]) {
          buff = {
            title: `元素精通：触发${mKey2[buff]}伤害值提高[${buff}]`,
            mastery: buff
          }
          buffs[idx] = buff
        }
      }
      buff.sort = lodash.isUndefined(buff.sort) ? 1 : buff.sort
    })
    buffs = lodash.sortBy(buffs, ['sort'])
    return buffs
  },
  // 圣遗物Buff
  getArtisBuffs (artis = {}, game = 'gs') {
    let retBuffs = []
    ProfileArtis._eachArtisSet(artis, (sets, num) => {
      let buffs = ArtifactSet.getArtisSetBuff(sets.name, num, game)
      if (lodash.isPlainObject(buffs)) {
        buffs = [buffs]
      }
      lodash.forEach(buffs, (buff) => {
        if (buff && !buff.isStatic) {
          retBuffs.push({
            ...buff,
            title: `${sets.name}${num}：` + buff.title
          })
        }
      })
    })
    return retBuffs
  },

  // 武器Buff
  getWeaponBuffs (wData, game = 'gs') {
    let weapon = Weapon.get(wData.name, game)
    if (!weapon) {
      return false
    }
    let affix = wData.refine || wData.affix
    let weaponCfg = weapon.getWeaponAffixBuffs(affix, false)

    let ret = []
    lodash.forEach(weaponCfg, (ds) => {
      if (ds.isStatic) {
        return true
      }
      ret.push(ds)
    })
    return ret
  }
}
export default DmgBuffs
