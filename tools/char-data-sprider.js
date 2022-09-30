import fs from 'fs'
import cheerio from 'cheerio'
import lodash from 'lodash'
import fetch from 'node-fetch'
import ImgDownloader from './sprider/ImgDown.js'
import CharData from './sprider/CharData.js'
import { Data } from '../components/index.js'
import tId from './sprider/TalentId.js'

const _path = process.cwd()
const _root = _path + '/plugins/miao-plugin/'
const _mRoot = _root + 'resources/meta/material/'

let mData = {}
if (fs.existsSync(_mRoot + 'data.json')) {
  mData = JSON.parse(fs.readFileSync(_mRoot + 'data.json', 'utf8'))
}

const tElems = ['anemo', 'geo', 'electro', 'dendro']

let getCharData = async function (id, key, name = '', _id = id) {
  let idNum = (id < 10 ? '0' : '') + (id < 100 ? '0' : '') + id
  let url = `https://genshin.honeyhunterworld.com/${key}_${idNum}/?lang=CHS`
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
  const $ = cheerio.load(txt)
  let sTxt = /sortable_data.push\((.*)\)/.exec(txt)
  if (sTxt && sTxt[1]) {
    // eslint-disable-next-line no-eval
    let tmp = eval(sTxt[1])
    for (let idx in tmp) {
      let t = tmp[idx].join('')
      if (/Namecard/.test(t)) {
        let r = /\/i_([n\d]+)\/\?/.exec(t)
        if (r && r[1]) {
          $._nid = r[1]
        }
      }
    }
  }
  let data = CharData.getBasic($, id, name, _id)
  name = name || data.name
  let imgs = new ImgDownloader(name)
  $.imgs = imgs
  let attr = CharData.getDetailAttr($)

  let ld = attr.details['90']
  data.baseAttr = {
    hp: ld[0] * 1,
    atk: ld[1] * 1,
    def: ld[2] * 1
  }
  data.growAttr = {
    key: attr.keys[3],
    value: ld[3]
  }

  let details = []
  let talentElem = {}
  let talentId
  let talentKey
  if (data.elem === 'multi') {
    talentKey = {}
    talentId = {}
    for (let idx in tElems) {
      let detail = CharData.getDetail($, id, name, idx * 1 + 1, tElems[idx])
      detail.attr = attr
      detail.elem = tElems[idx]
      details.push(detail)
      lodash.forEach(detail.talent, (ds, k) => {
        talentKey[ds.id] = k
        if (k === 'e' || k === 'q') {
          talentElem[ds.id] = tElems[idx]
        }
      })
      const te = {
        anemo: 4,
        geo: 6,
        electro: 7,
        dendro: 8
      }
      let cid = `1000000${id}-${id}0${te[tElems[idx]]}`
      lodash.forEach(tId[cid].ProudMap || {}, (v, k) => {
        talentId[k] = v
      })
    }
  } else {
    details.push(CharData.getDetail($, id, name))
    talentId = tId[(10000000 + id * 1)]?.ProudMap || {}
  }
  let detail = details[0]
  let { talent, cons } = detail
  // data.talent = lodash.mapValues(talent, (t) => t.name)
  data.talentKey = talentKey || lodash.invert(lodash.mapValues(talent, (t) => t.id))
  data.talentId = talentId
  if (data.elem === 'multi') {
    data.talentElem = talentElem
  }
  data.talentCons = CharData.getConsTalent(talent, cons)
  /*
  data.passive = lodash.map(passive, (t) => t.name)
  data.cons = lodash.map(cons, (t) => t.name)
   */
  data.materials = CharData.getMaterials($, mData)
  CharData.getImgs($)
  return {
    data,
    details,
    imgs
  }
}

function checkName (name) {
  let charPath = `resources/meta/character/${name}/`
  Data.createDir(charPath)
  if (name === '旅行者') {
    for (let idx in tElems) {
      Data.createDir(`${charPath}${tElems[idx]}/icons`)
    }
  } else {
    Data.createDir(`${charPath}/icons`)
  }
  Data.createDir(`${charPath}/imgs`)
  let data = Data.readJSON(`${charPath}/data.json`)
  return data.ver * 1 > 1
}

async function saveCharData (id, key, name = '', force = false, _id = id) {
  if (!id || !key) {
    return
  }
  if (name && checkName(name) && !force) {
    return
  }
  let { data, details, imgs } = await getCharData(id, key, name, _id)
  name = name || data.name

  if (!name) {
    console.log(`角色名不存在${id}:${key}`)
    return
  }
  if (checkName(name) && !force) {
    return
  }
  let charPath = `${_path}/plugins/miao-plugin/resources/meta/character/${name}/`
  fs.writeFileSync(`${charPath}data.json`, JSON.stringify(data, '', 2))
  if (details.length === 1) {
    fs.writeFileSync(`${charPath}detail.json`, JSON.stringify(details[0], '', 2))
  } else if (data.id === 20000000) {
    for (let idx in details) {
      let detail = details[idx]
      fs.writeFileSync(`${charPath}/${detail.elem}/detail.json`, JSON.stringify(detail, '', 2))
    }
  }

  console.log(data.name + '数据下载完成')
  if (![10000005, 10000007].includes(data.id)) {
    await imgs.download()
    console.log(data.name + '图像全部下载完成')
  }
}

async function down (name = '', force = false) {
  if (name === '') {
    name = lodash.keys(charData).join(',')
  }
  let names = name.split(',')
  for (let id in charData) {
    let ds = charData[id]
    if (!names.includes(id) && !names.includes(ds.key) && !names.includes(ds.name)) {
      continue
    }
    await saveCharData(ds.id || id, ds.key, ds.name, force, id)
  }
  fs.writeFileSync(`${_mRoot}data.json`, JSON.stringify(mData, '', 2))
}

const charData = {
  2: { key: 'ayaka', name: '神里绫华' },
  3: { key: 'qin', name: '琴' },
  4: { key: 'playergirl', name: '旅行者', id: 7 },
  5: { key: 'playerboy', name: '空' },
  6: { key: 'lisa', name: '丽莎' },
  7: { key: 'playergirl', name: '荧' },
  14: { key: 'barbara', name: '芭芭拉' },
  15: { key: 'kaeya', name: '凯亚' },
  16: { key: 'diluc', name: '迪卢克' },
  20: { key: 'razor', name: '雷泽' },
  21: { key: 'ambor', name: '安柏' },
  22: { key: 'venti', name: '温迪' },
  23: { key: 'xiangling', name: '香菱' },
  24: { key: 'beidou', name: '北斗' },
  25: { key: 'xingqiu', name: '行秋' },
  26: { key: 'xiao', name: '魈' },
  27: { key: 'ningguang', name: '凝光' },
  29: { key: 'klee', name: '可莉' },
  30: { key: 'zhongli', name: '钟离' },
  31: { key: 'fischl', name: '菲谢尔' },
  32: { key: 'bennett', name: '班尼特' },
  33: { key: 'tartaglia', name: '达达利亚' },
  34: { key: 'noel', name: '诺艾尔' },
  35: { key: 'qiqi', name: '七七' },
  36: { key: 'chongyun', name: '重云' },
  37: { key: 'ganyu', name: '甘雨' },
  38: { key: 'albedo', name: '阿贝多' },
  39: { key: 'diona', name: '迪奥娜' },
  41: { key: 'mona', name: '莫娜' },
  42: { key: 'keqing', name: '刻晴' },
  43: { key: 'sucrose', name: '砂糖' },
  44: { key: 'xinyan', name: '辛焱' },
  45: { key: 'rosaria', name: '罗莎莉亚' },
  46: { key: 'hutao', name: '胡桃' },
  47: { key: 'kazuha', name: '枫原万叶' },
  48: { key: 'feiyan', name: '烟绯' },
  49: { key: 'yoimiya', name: '宵宫' },
  50: { key: 'tohma', name: '托马' },
  51: { key: 'eula', name: '优菈' },
  52: { key: 'shougun', name: '雷电将军' },
  53: { key: 'sayu', name: '早柚' },
  54: { key: 'kokomi', name: '珊瑚宫心海' },
  55: { key: 'gorou', name: '五郎' },
  56: { key: 'sara', name: '九条裟罗' },
  57: { key: 'itto', name: '荒泷一斗' },
  58: { key: 'yae', name: '八重神子' },
  59: { key: 'heizo', name: '鹿野院平藏' },
  60: { key: 'yelan', name: '夜兰' },
  62: { key: 'aloy', name: '埃洛伊' },
  63: { key: 'shenhe', name: '申鹤' },
  64: { key: 'yunjin', name: '云堇' },
  65: { key: 'shinobu', name: '久岐忍' },
  66: { key: 'ayato', name: '神里绫人' },
  67: { key: 'collei', name: '柯莱' },
  68: { key: 'dori', name: '多莉' },
  69: { key: 'tighnari', name: '提纳里' },
  70: { key: 'nilou', name: '妮露' },
  71: { key: 'cyno', name: '赛诺' },
  72: { key: 'candace', name: '坎蒂丝' },
  73: { key: 'nahida', name: '纳西妲' },
  74: { key: 'layla', name: '莱依拉' }
}
await down('73', true)
