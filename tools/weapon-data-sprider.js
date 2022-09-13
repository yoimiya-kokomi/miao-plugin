import fetch from 'node-fetch';
import cheerio from 'cheerio';
import lodash from 'lodash'
import { Data } from '../components/index.js'

let ret = Data.readJSON('resources/meta/weapons/data.json')

let getWeaponData = async function (type) {
  let url = `https://genshin.honeyhunterworld.com/fam_${type}/?lang=CHS`
  console.log('req: ' + url)
  let req = await fetch(url, {
    method: 'GET',
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.20',
      referer: 'https://genshin.honeyhunterworld.com/fam_chars/?lang=CHS',
      'sec-ch-ua': '"Microsoft Edge";v = "105", " Not;A Brand";v = "99", "Chromium";v = "105"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': 'Windows',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': 1
    }
  })
  let txt = await req.text()
  let sTxt = /sortable_data.push\((.*)\)/.exec(txt)
  if (sTxt && sTxt[1]) {
    let tmp = eval(sTxt[1])
    lodash.forEach(tmp, (ds) => {
      let name = cheerio.load(ds[1])('a').text()
      let star = cheerio.load(ds[2])('img').length
      ret[name] = {
        name,
        star,
        type
      }
    })
  }
}
for (let type of ['sword', 'claymore', 'polearm', 'bow', 'catalyst']) {
  await getWeaponData(type)
}
Data.writeJSON('resources/meta/weapons/data.json', ret)
