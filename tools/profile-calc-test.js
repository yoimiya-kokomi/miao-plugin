import fs from 'fs'
import { Profile } from '../components/index.js'
import AttrCalc from '../models/profile-lib/AttrCalc.js'
import lodash from 'lodash'

let _path = process.cwd()

function testCalcAttr (profile) {
  if (profile.hasData) {
    let attrCalc = AttrCalc.create(profile)
    let attr2 = attrCalc.calc()
    let char = profile.char
    let ret = {}
    lodash.forEach(profile.attr, (val, key) => {
      let diff = val - (attr2[key] || 0)
      if (Math.abs(diff / val) > 0.005 && Math.abs(diff) > 0.99) {
        ret[key] = [val, attr2[key]]
      }
    })
    if (!lodash.isEmpty(ret)) {
      let retKeys = lodash.keys(ret)
      let retKeyStr = lodash.keys(ret).join(',')
      let ret2 = lodash.extend({}, ret)
      if (retKeyStr === 'hp') {
        let [s, d] = ret.hp
        let hpBase = profile.attr?.hpBase
        let pct = Math.round((s - d) / hpBase * 100)
        if ([6, 12, 18, 30, 25, 31, 37, 43, 55].includes(pct)) {
          delete ret.hp
        }
      }
      if ((ret.atkBase) || (retKeys.length === 2 && ret.atkBase && ret.atk)) {

        if ([1, 20, 40, 50, 60, 70, 80, 90].includes(profile.weapon.level)) {
          delete ret.atkBase
          delete ret.atk
        }
      }
      if (ret.def && ret.defBase && ret.hp && ret.hpBase) {
        let [s, d] = ret.defBase
        if (s > d && [1, 20, 40, 50, 60, 70, 80, 90].includes(profile.level)) {
          delete ret.def
          delete ret.defBase
          delete ret.hp
          delete ret.hpBase
          delete ret[char.detail?.attr?.keys[3]]
        }
      }
      if (retKeyStr === 'recharge') {
        if (char.isTraveler && char.isElem('风')) {
          delete ret.recharge
        }
      }
      if (retKeyStr === 'dmg') {
        let [s, d] = ret.dmg
        let dmg = Math.round(Math.abs(s - d - 46.6))
        console.log(dmg)
        if ([0, 15].includes(dmg) || char.name === '莫娜') {
          delete ret.dmg
        }
      }
      let cmd = `#${profile.name}面板${profile.uid}`
      if (lodash.isEmpty(ret)) {
        console.log(`Calc IGNORE: ${cmd}`)
        return true
      } else {
        console.log(`Calc Diff: ${cmd}`, ret2)
      }
      return false
    } else {
      console.log(`Calc OK:${profile.uid}:${profile.id}`)
      return true
    }
  } else {
    console.log('!has data')
    return true
  }
}

async function test (ignore) {
  let files = fs.readdirSync(`${_path}/data/UserData`)
  let count = 0
  let total = 0
  for (let file of files) {
    if (count > 0) {
      break
    }
    let testRet = /(\d{9}).json/.exec(file)
    if (testRet && testRet[1]) {
      let uid = testRet[1]
      if (ignore.includes(uid * 1)) {
        continue
      }
      Profile.forEach(uid, (profile) => {
        if (count > 0) {
          return false
        }
        let cmd = `#${profile.name}面板${profile.uid}`
        if (ignore.includes(cmd)) {
          return true
        }
        console.log(profile.id)
        let ret = testCalcAttr(profile)
        if (ret === false) {
          count++
        }
        total++
      })
    }
  }
  console.log(`calc test done total:${total}`)
  return true
}

const ignore = ['#荧面板100000023', '#班尼特面板100009630', '#荧面板100147429', '#八重神子面板100160080', '#纳西妲面板100181800', '#荧面板100211780',
  '#九条裟罗面板100248492', '#砂糖面板100270260']
await test(ignore)
