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

let rule = {
  characterApp: character.rule(),
  adminApp: character.rule(),
  helpApp: help.rule(),
  statApp: stat.rule(),
  wikiApp: wiki.rule()
}

export { rule }
