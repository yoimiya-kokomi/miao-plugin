import fs from 'fs'
import cheerio from 'cheerio'
import lodash from 'lodash'
import fetch from 'node-fetch'
import ImgDownloader from './sprider/ImgDown.js'
import CharData from './sprider/CharDataAmber.js'
import { Data } from '#miao'
import tId from './sprider/TalentId.js'

import testData from './test.js'

const _path = process.cwd()
const _root = _path + '/plugins/miao-plugin/'
const _mRoot = _root + 'resources/meta/material/'

let mData = {}
if (fs.existsSync(_mRoot + 'data.json')) {
  mData = JSON.parse(fs.readFileSync(_mRoot + 'data.json', 'utf8'))
}

const tElems = ['anemo', 'geo', 'electro', 'dendro']

let getCharData = async function (id, key, name = '', _id = id) {
  let url = `https://api.ambr.top/v2/chs/avatar/100000${id}`
  console.log('req: ' + url)
  let req = await fetch(url)
  let reqData = await req.json()
  reqData = reqData.data
  console.log(reqData.id)
  let data = CharData.getBasic(reqData)
  name = name || data.name
  let imgs = new ImgDownloader(name)
  let attr = CharData.getDetailAttr(reqData)
  data.baseAttr = {}
  data.growAttr = {}
  let talentId
  let talentKey
  let detail = CharData.getDetail(reqData)
  let { talent, cons } = detail
  data.talentKey = talentKey || lodash.invert(lodash.mapValues(talent, (t) => t.id))
  data.talentId = talentId
  data.talentCons = CharData.getConsTalent(talent, cons)
  return {
    data,
    details: [detail],
    imgs
  }
}

function checkName (name) {
  let charPath = `resources/meta/character/${name}/`
  Data.createDir(charPath, 'miao')
  if (name === '旅行者') {
    for (let idx in tElems) {
      Data.createDir(`${charPath}${tElems[idx]}/icons`, 'miao')
    }
  } else {
    Data.createDir(`${charPath}/icons`, 'miao')
  }
  Data.createDir(`${charPath}/imgs`, 'miao')
  let data = Data.readJSON(`${charPath}/data.json`, 'miao')
  return data.ver * 1 > 1
}

async function saveCharData (id) {

  let { data, details, imgs } = await getCharData(id)
  let name = data.name

  if (!name) {
    console.log(`角色名不存在${id}:${name}`)
    return
  }

  Data.createDir(`resources/meta/character/${name}/`, 'miao')

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
    await saveCharData(id)
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
  73: '纳西妲',
  74: '莱依拉'
}
await down('73,74', true)
