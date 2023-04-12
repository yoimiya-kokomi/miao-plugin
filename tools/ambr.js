import fs from 'fs'
import lodash from 'lodash'
import fetch from 'node-fetch'
import ImgDownloader from './sprider/ImgDown.js'
import CharData from './sprider/CharDataAmber.js'
import { Data } from '#miao'



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
  61: '绮良良'
}
await down('61', true)
