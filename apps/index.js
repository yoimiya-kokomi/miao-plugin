import help from './help.js'
import character from './character.js'
import admin from './admin.js'
import stat from './stat.js'
import wiki from './wiki.js'

export const characterApp = character.v2()
export const adminApp = admin.v2()
export const helpApp = help.v2()
export const statApp = stat.v2()
export const wikiApp = wiki.v2()

let apps = { character, admin, help, stat, wiki }
let rule = {} // v2
let rules = {} // v3
for (let key in apps) {
  rule[`${key}App`] = apps[key].rule()
  rules[`${key}`] = apps[key].app()
}

export { rule, rules as apps }
