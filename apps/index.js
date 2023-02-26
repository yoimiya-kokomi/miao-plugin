import character from './character.js'
import profile from './profile.js'
import stat from './stat.js'
import wiki from './wiki.js'
import poke from './poke.js'
import help from './help.js'
import admin from './admin.js'
import gacha from './gacha.js'

export const characterApp = character.v2App()
export const profileApp = profile.v2App()
export const adminApp = admin.v2App()
export const helpApp = help.v2App()
export const statApp = stat.v2App()
export const wikiApp = wiki.v2App()
export const pokeApp = poke.v2App()
export const gachaApp = gacha.v2App()

let apps = { character, poke, profile, stat, wiki, gacha, admin, help }
let rule = {} // v2
let rules = {} // v3
for (let key in apps) {
  rule[`${key}App`] = apps[key].v2Rule()
  rules[`${key}`] = apps[key].v3App()
}

export { rule, rules as apps }
