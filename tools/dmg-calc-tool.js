import Profile from '../components/Profile.js'
import Calc from '../components/Calc.js'
import { Character } from '../components/models.js'
import Miao from '../components/profile-data/miao.js'

export async function calcDmg (inputData, enemyLv = 86) {
  let profile = Miao.getAvatarDetail(inputData)
  console.log(profile)
  let char = Character.get(profile)
  return await Calc.calcData({ profile, char, enemyLv })
}