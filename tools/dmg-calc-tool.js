import { Data } from '../components/index.js'
import { ProfileDmg } from '../models/index.js'

export async function calcDmg (inputData, enemyLv = 86) {
  let dmg = new ProfileDmg(inputData)
  let ret = await dmg.calcData({ enemyLv })
  ret = Data.getData(ret, 'ret,msg,enemyName')
  ret.enemyLevel = enemyLv
  return ret
}
