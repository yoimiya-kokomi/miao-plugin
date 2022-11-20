import fetch from 'node-fetch'
import cheerio from 'cheerio'
import lodash from 'lodash'
import { Data } from '../components/index.js'
import fs from 'fs'
import request from 'request'
import WeaponData from './sprider/WeaponData.js'
import ImgDownloader from './sprider/ImgDown.js'

let ret = {}
const types = ['sword', 'claymore', 'polearm', 'bow', 'catalyst']
for (let type of types) {
  ret[type] = Data.readJSON(`resources/meta/weapon/${type}/data.json`)
}

let mData = Data.readJSON('resources/meta/material/data.json')

let getWeaponTypeData = async function (type) {
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
      let a = cheerio.load(ds[1])('a')
      let name = a.text()
      let idRet = /i_(.*)\//.exec(a.attr('href'))
      let star = cheerio.load(ds[2])('img').length
      let id = idRet && idRet[1] ? idRet[1] : ''
      ret[type] = ret[type] || {}
      ret[type][name] = {
        id,
        name,
        star
      }
    })
  }
}
let getWeaponData = async function (type, ds) {
  let { id, name } = ds
  let url = `https://genshin.honeyhunterworld.com/i_${id}/?lang=CHS`
  console.log(`req:[${name}], ${url}`)
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
  let $ = cheerio.load(txt)
  let imgs = new ImgDownloader(name)
  $.imgs = imgs
  let ret = WeaponData.getDetail($, ds, mData)
  await $.imgs.download()
  return ret
}

async function down (t) {
  for (let type of types) {
    if (type !== t) {
      continue
    }
    await getWeaponTypeData(type)
    Data.createDir(`resources/meta/weapon/${type}`)
    Data.writeJSON(`resources/meta/weapon/${type}/data.json`, ret[type])

    let imgs = []
    for (let name in ret[type]) {
      if (name !== '白铁大剑') {

      }
      let ds = ret[type][name]
      Data.createDir(`resources/meta/weapon/${type}/${ds.name}`)
      let data = await getWeaponData(type, ds)
      Data.writeJSON(`resources/meta/weapon/${type}/${ds.name}/data.json`, data)
      lodash.forEach({
        icon: '',
        awaken: '_awaken_icon',
        gacha: '_gacha_icon'
      }, (affix, key) => {
        imgs.push({
          url: `img/i_${ds.id}${affix}.webp`,
          file: `${type}/${ds.name}/${key}.webp`
        })
      })
    }
    const _path = process.cwd()
    const _root = _path + '/plugins/miao-plugin/'
    const _wRoot = _root + 'resources/meta/weapon/'
    await Data.asyncPool(5, imgs, async function (ds) {
      if (fs.existsSync(`${_wRoot}/${ds.file}`)) {
        // console.log(`已存在，跳过 ${ds.file}`)
        return true
      }

      try {
        let stream = fs.createWriteStream(`${_wRoot}/${ds.file}.tmp`)
        await request('https://genshin.honeyhunterworld.com/' + ds.url).pipe(stream)
        return new Promise((resolve) => {
          stream.on('finish', () => {
            fs.rename(`${_wRoot}/${ds.file}.tmp`, `${_wRoot}/${ds.file}`, () => {
              console.log(`图像下载成功: ${ds.file}`)
              resolve()
            })
          })
        })
      } catch (e) {
        console.log(`图像下载失败: ${ds.file}`)
        console.log(e)
        return false
      }
    })
  }
  Data.writeJSON('resources/meta/material/data.json', mData)
}

// 'sword', 'claymore', 'polearm', 'bow', 'catalyst'
await down('bow')
