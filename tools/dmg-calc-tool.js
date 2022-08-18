import Calc from '../models/profile-lib/Calc.js'
import { Character } from '../models/index.js'
import Miao from '../components/profile-data/miao.js'

export async function calcDmg (inputData, enemyLv = 86) {
  let profile = Miao.getAvatarDetail(inputData)
  console.log(profile)
  let char = Character.get(profile)
  return await Calc.calcData({ profile, char, enemyLv })
}