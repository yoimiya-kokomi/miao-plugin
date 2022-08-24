import fs from 'fs'
import _puppeteer from './lib/puppeteer.js'
import _plugin from './lib/plugin.js'

const importV3 = async function (file, def, key = 'default') {
  if (fs.existsSync(process.cwd() + file)) {
    let obj = await import(`file://${process.cwd()}/${file}`)
    return obj[key] || def
  }
  return def
}

let MysInfo = await importV3('/plugins/genshin/model/mys/mysInfo.js')
let plugin = await importV3('lib/plugins/plugin.js', _plugin)
let puppeteer = await importV3('/lib/puppeteer/puppeteer.js', _puppeteer)
export {
  plugin,
  MysInfo,
  puppeteer
}
