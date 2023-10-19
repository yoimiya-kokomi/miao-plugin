import { Data, Meta } from '#miao'
import { alias } from './meta.js'

let data = Data.readJSON('resources/meta/character/data.json', 'miao')
Meta.addMeta('gs', 'char', data)
Meta.addAlias('gs', 'char', alias)

export const game = 'gs'
export const dataType = 'char'
