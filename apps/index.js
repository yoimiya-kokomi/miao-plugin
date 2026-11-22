import character from './character.js'
import profile from './profile.js'
import stat from './stat.js'
import wiki from './wiki.js'
import poke from './poke.js'
import help from './help.js'
import admin from './admin.js'
import gacha from './gacha.js'
import alias from './alias.js'
import SrGachaLog from './gacha/SrGachaLog.js'

let apps = { character, poke, profile, stat, wiki, gacha, admin, help, alias }
let rules = {} // v3
for (let key in apps) {
  rules[`${key}`] = apps[key].v3App()
}
rules.srGachaLog = SrGachaLog

export { rules as apps }
