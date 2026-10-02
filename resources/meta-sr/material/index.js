import { Data, Meta } from '#miao'

let data = Data.readJSON('resources/meta-sr/material/data.json', 'miao')

const meta = Meta.create('sr', 'material')
meta.addData(data)
