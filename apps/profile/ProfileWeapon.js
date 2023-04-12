import { ProfileData, Weapon } from '#miao.models'
import { Data } from '#miao'

export const ProfileWeapon = {
  async calc (profile) {
    let ret = []
    await Weapon.forEach(async (w) => {
      let weaponRet = w.getData('name,star,abbr,icon')
      weaponRet.dmgs = []
      for (let affix of [1, 5]) {
        if (affix === 5 && w.maxAffix !== 5) {
          continue
        }
        let tempProfile = new ProfileData({
          ...profile.getData('uid,id,level,cons,fetter,elem,promote,talent,artis'),
          dataSource: 'change'
        }, false)

        tempProfile.setWeapon({
          name: w.name,
          star: w.star,
          level: w.maxLv,
          promote: w.maxPromote,
          affix
        })
        tempProfile.calcAttr()
        weaponRet.dmgs.push({
          affix,
          ...await tempProfile.calcDmg({ mode: 'single' })
        })
      }
      ret.push(weaponRet)
    }, profile?.weapon?.type)
    return ret
  }

}