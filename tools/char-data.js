import cheerio from 'cheerio'
import lodash from 'lodash'
import fetch from 'node-fetch'
import ImgDownloader from './sprider/ImgDown.js'
import CharData from './sprider/CharData.js'
import { Data } from '../components/index.js'
import tId from './sprider/TalentId.js'

let mData = Data.readJSON('/resources/meta/material/data.json')

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
  let metas = []
  let talentElem = {}
  let talentId
  let talentKey
  if (data.elem === 'multi') {
    talentKey = {}
    talentId = {}
    for (let idx in tElems) {
      let detail = CharData.getDetail({ $, id, name, setIdx: idx * 1 + 1, elem: tElems[idx] })
      detail.attr = attr
      detail.elem = tElems[idx]
      details.push(detail)
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
      lodash.forEach(detail.talent, (ds, k) => {
        talentKey[ds.id] = k
        if (k === 'e' || k === 'q') {
          talentElem[ds.id] = tElems[idx]
        }
      })
    }
  } else {
    let detail = CharData.getDetail({ $, id, name })
    details.push(detail)
    talentId = tId[(10000000 + id * 1)]?.ProudMap || {}
  }
  let detail = details[0]
  let { talent, cons } = detail
  talentKey = talentKey || lodash.invert(lodash.mapValues(talent, (t) => t.id))
  data.talentId = {}
  let talentKeyId = {}
  lodash.forEach(talentId, (tid, id) => {
    data.talentId[id] = talentKey[tid]
    talentKeyId[tid] = id
  })
  if (data.elem === 'multi') {
    data.talentElem = {}
    lodash.forEach(talentElem, (elem, tid) => {
      data.talentElem[talentKeyId[tid]] = elem
    })
  }
  data.talentCons = CharData.getConsTalent(talent, cons)
  data.materials = CharData.getMaterials($, mData)
  CharData.getImgs($)
  return {
    data,
    details,
    metas,
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
  if (eta[name]) {
    data.eta = new Date(`${eta[name]} 10:00:00`) * 1
  }
  let charPath = `/resources/meta/character/${name}/`
  // fs.writeFileSync(`${charPath}data.json`, JSON.stringify(data, '', 2).replaceAll('\n', '\r\n'))
  Data.writeJSON({ path: charPath, name: 'data.json', data, rn: true })
  if (details.length === 1) {
    // fs.writeFileSync(`${charPath}detail.json`, JSON.stringify(details[0], '', 2).replaceAll('\n', '\r\n'))
    Data.writeJSON({ path: charPath, name: 'detail.json', data: details[0], rn: true })
  } else if (data.id === 20000000) {
    for (let idx in details) {
      let detail = details[idx]
      // fs.writeFileSync(`${charPath}/${detail.elem}/detail.json`, JSON.stringify(detail, '', 2).replaceAll('\n', '\r\n'))
      Data.writeJSON({ path: `${charPath}/${detail.elem}`, name: 'detail.json', data: detail, rn: true })
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
    if (typeof (ds) === 'string') {
      ds = ds.split(',')
      ds = { key: ds[0], name: ds[1] }
    }

    if (!names.includes(id) && !names.includes(ds.key) && !names.includes(ds.name)) {
      continue
    }
    await saveCharData(ds.id || id, ds.key, ds.name, force, id)
  }
  Data.writeJSON({ name: '/resources/meta/material/data.json', data: mData, rn: true })
}

const charData = {
  2: 'ayaka,神里绫华',
  3: 'qin,琴',
  4: { key: 'playergirl', name: '旅行者', id: 7 },
  5: 'playerboy,空',
  6: 'lisa,丽莎',
  7: 'playergirl,荧',
  14: 'barbara,芭芭拉',
  15: 'kaeya,凯亚',
  16: 'diluc,迪卢克',
  20: 'razor,雷泽',
  21: 'ambor,安柏',
  22: 'venti,温迪',
  23: 'xiangling,香菱',
  24: 'beidou,北斗',
  25: 'xingqiu,行秋',
  26: 'xiao,魈',
  27: 'ningguang,凝光',
  29: 'klee,可莉',
  30: 'zhongli,钟离',
  31: 'fischl,菲谢尔',
  32: 'bennett,班尼特',
  33: 'tartaglia,达达利亚',
  34: 'noel,诺艾尔',
  35: 'qiqi,七七',
  36: 'chongyun,重云',
  37: 'ganyu,甘雨',
  38: 'albedo,阿贝多',
  39: 'diona,迪奥娜',
  41: 'mona,莫娜',
  42: 'keqing,刻晴',
  43: 'sucrose,砂糖',
  44: 'xinyan,辛焱',
  45: 'rosaria,罗莎莉亚',
  46: 'hutao,胡桃',
  47: 'kazuha,枫原万叶',
  48: 'feiyan,烟绯',
  49: 'yoimiya,宵宫',
  50: 'tohma,托马',
  51: 'eula,优菈',
  52: 'shougun,雷电将军',
  53: 'sayu,早柚',
  54: 'kokomi,珊瑚宫心海',
  55: 'gorou,五郎',
  56: 'sara,九条裟罗',
  57: 'itto,荒泷一斗',
  58: 'yae,八重神子',
  59: 'heizo,鹿野院平藏',
  60: 'yelan,夜兰',
  62: 'aloy,埃洛伊',
  63: 'shenhe,申鹤',
  64: 'yunjin,云堇',
  65: 'shinobu,久岐忍',
  66: 'ayato,神里绫人',
  67: 'collei,柯莱',
  68: 'dori,多莉',
  69: 'tighnari,提纳里',
  70: 'nilou,妮露',
  71: 'cyno,赛诺',
  72: 'candace,坎蒂丝',
  73: 'nahida,纳西妲',
  74: 'layla,莱依拉',
  75: 'wanderer,流浪者',
  76: 'faruzan,珐露珊',
  77: 'yaoyao,瑶瑶',
  78: 'alhatham,艾尔海森',
  79: 'dehya,迪希雅',
  80: 'mika,米卡'
}
let eta = {
  妮露: '2022-10-14',
  纳西妲: '2022-11-02',
  莱依拉: '2022-11-02',
  流浪者: '2022-12-07',
  珐露珊: '2022-12-07',
  瑶瑶: '2023-01-18',
  艾尔海森: '2023-01-18',
  迪希雅: '2023-03-01',
  米卡: '2023-03-01'
}
await down('香菱', true)
