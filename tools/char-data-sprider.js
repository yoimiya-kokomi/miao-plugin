import fs from 'fs'
import cheerio from 'cheerio'
import lodash from 'lodash'
import fetch from 'node-fetch'
import { roleId, abbr } from '../../../config/genshin/roleId.js'
import request from 'request'
import { Data } from '../components/index.js'

const _path = process.cwd()
const _root = _path + '/plugins/miao-plugin/'
const _cRoot = _root + 'resources/meta/character/'

let roleIdMap = {}
lodash.forEach(roleId, (names, id) => {
  roleIdMap[names[0]] = id
})

class Img {
  constructor (name) {
    this.name = name
    this.imgs = []
  }

  add (key, url) {
    this.imgs.push({
      url,
      file: `${this.name}/${key}.webp`
    })
  }

  async _down (ds) {
    if (fs.existsSync(`${_cRoot}/${ds.file}`)) {
      // console.log(`已存在，跳过 ${ds.file}`)
      return true
    }
    try {
      let stream = fs.createWriteStream(`${_cRoot}/${ds.file}`)
      await request('https://genshin.honeyhunterworld.com/' + ds.url).pipe(stream)
      return new Promise((resolve) => {
        stream.on('finish', () => {
          console.log(`图像下载成功: ${ds.file}`)
          resolve()
        })
      })
    } catch (e) {
      console.log(`图像下载失败: ${ds.file}`)
      console.log(e)
      return false
    }
  }

  async download () {
    await Data.asyncPool(5, this.imgs, this._down)
  }
}

function getBasic ($, id) {
  let ret = {}
  ret.name = $('.wp-block-post-title').text()
  ret.abbr = abbr[ret.name] || ret.name
  ret.id = 10000000 + id * 1
  let basic = $('.genshin_table.main_table')
  let title = function (title) {
    return basic.find(`td:contains('${title}')`).next('td').text().trim()
  }
  ret.title = title('Title')
  ret.star = basic.find('td:contains(\'Rarity\')').next('td').find('.cur_icon').length
  ret.elem = title('Element').toLowerCase()
  ret.allegiance = title('Occupation')
  ret.weapon = title('Weapon')
  ret.britydah = title('Month of Birth') + '-' + title('Day of Birth')
  ret.astro = title('Constellation')
  ret.cncv = title('Chinese')
  ret.jpcv = title('Japanese')
  ret.ver = 1
  ret.desc = title('Description')
  return ret
}

function getStat ($) {
  // 采集属性信息
  let stat = $('.genshin_table.stat_table:first')
  let attrs = []
  let colIdxs = {}
  const titleMap = {
    HP: 'hpBase',
    Atk: 'atkBase',
    Def: 'defBase'
  }
  const bonusMap = {
    Atk: 'atkPct',
    HP: 'hpPct',
    CritDMG: 'cdmg',
    ER: 'recharge',
    Geo: 'dmg',
    Hydro: 'dmg',
    Anemo: 'dmg',
    Dendro: 'dmg',
    Pyro: 'dmg',
    Cryo: 'dmg',
    Electro: 'dmg',
    Heal: 'heal',
    Phys: 'phy'
  }
  stat.find('tr:first td:lt(8)').each(function (i) {
    let title = $(this).text()
    let titleRet = /^Bonus\s(\w+)%*$/.exec(title)
    if (titleRet && titleRet[1]) {
      attrs.push(bonusMap[titleRet[1]] || titleRet[1])
      colIdxs[i] = true
    } else if (titleMap[title]) {
      attrs.push(titleMap[title])
      colIdxs[i] = true
    }
  })
  let lvs = []
  let lvStat = {}
  stat.find('tr:gt(0)').each(function (i) {
    if (i === 3 || i === 4) {
      return
    }
    let tr = $(this)
    let lvl = tr.find('td:first').text()
    lvs.push(lvl)
    let data = []
    tr.find('td:lt(8)').each(function (i) {
      if (!colIdxs[i]) {
        return
      }
      data.push($(this).text())
    })
    lvStat[lvl] = data
  })
  return {
    attrs,
    detail: lvStat
  }
}

function getTalents ($, imgKey, eq, onlyLv1 = false) {
  let info = $(`.genshin_table.skill_table:eq(${eq})`)

  let name = info.find('tr:first td:eq(1)').text()
  let icon = info.find('tr:first td:first img').attr('src')
  $.imgs.add(imgKey, icon)

  // 说明
  let desc = info.find('tr:eq(1) td').html()
  desc = desc.replace(/<color=[^>]*>/g, '')
  desc = desc.replace(/<\/color=[^>]*>/g, '')
  desc = desc.replace(/<span class=[^>]*>/g, '<strong>')
  desc = desc.replace(/<\/span>/g, '</strong>')
  desc = desc.split('<br>')
  lodash.forEach(desc, (txt, i) => {
    desc[i] = lodash.trim(txt)
  })

  // detail
  let detail = $(`.genshin_table.skill_dmg_table:eq(${eq})`)
  let lvs = []
  let details = []
  detail.find('tr:first td').each(function (i) {
    if (onlyLv1 && i > 1) {
      return false
    }
    if (i > 0) {
      lvs.push($(this).text())
    }
  })
  detail.find('tr:gt(0)').each(function () {
    let name = $(this).find('td:eq(0)').text()
    let values = []
    let isSame = true
    $(this).find('td:gt(0)').each(function (i) {
      if (onlyLv1 && i > 0) {
        return false
      }
      let val = lodash.trim($(this).text())
      values.push(val)
      if (i > 0 && values[0] !== val) {
        isSame = false
      }
    })

    details.push({
      name,
      icon,
      isSame,
      values
    })
  })

  return {
    name,
    icon,
    desc,
    tables: details,
    lvs
  }
}

let getPassive = function ($, name) {
  let tables = $('#char_skills>span.delim h3:contains("Passive Skills")').parent().nextUntil('span.delim')
  let ret = []
  tables.each(function () {
    let ds = {}
    $.imgs.add(`icons/passive-${ret.length}`, $(this).find('img').attr('src'))
    ds.name = $(this).find('tr:first td:eq(1)').text()
    ds.desc = $(this).find('tr:eq(1) td:first').text()
    ret.push(ds)
  })
  if (name === '莫娜' || name === '神里绫华') {
    ret.push(getTalents($, `icons/passive-${ret.length}`, 2, true))
  }
  return ret
}

let getCons = function ($) {
  let tables = $('#char_skills>span.delim h3:contains("Constellations")').parent().nextAll('.skill_table')
  let ret = {}
  tables.each(function (idx) {
    let ds = {}
    $.imgs.add(`icons/cons-${idx + 1}`, $(this).find('img').attr('src'))
    ds.name = $(this).find('tr:first td:eq(1)').text()
    ds.desc = $(this).find('tr:eq(1) td:first').text()
    ret[idx + 1] = ds
  })
  return ret
}

let getImgs = function ($) {
  let urls = {}
  $('#char_gallery a>span.gallery_cont_span').each(function () {
    urls[$(this).text()] = $(this).parent().attr('href')
  })
  let img = function (title, key) {
    if (urls[title]) {
      $.imgs.add(key, urls[title])
    }
  }
  img('Icon', 'imgs/face')
  img('Side Icon', 'imgs/side')
  img('Gacha Card', 'imgs/gacha')
  img('Gacha Splash', 'imgs/splash')
  if ($._nid) {
    $.imgs.add('imgs/banner', `img/i_n${$._nid}_back.webp`)
    $.imgs.add('imgs/card', `img/i_n${$._nid}_profile.webp`)
  }
}

let getCharData = async function (id, key) {
  let idNum = (id < 100 ? '0' : '') + id
  let url = `https://genshin.honeyhunterworld.com/${key}_${idNum}/?lang=CHS`
  console.log('req' + url)
  let req = await fetch(url)
  let txt = await req.text()
  const $ = cheerio.load(txt)
  let sTxt = /sortable_data.push\((.*)\)/.exec(txt)
  if (sTxt && sTxt[1]) {
    let tmp = eval(sTxt[1])
    for (let idx in tmp) {
      let t = tmp[idx].join('')
      if (/Namecard/.test(t)) {
        let r = /\/i_n(\d+)\/\?/.exec(t)
        if (r && r[1]) {
          $._nid = r[1]
        }
      }
    }
  }

  let ret = getBasic($, id)
  let name = ret.name
  let imgs = new Img(name)
  $.imgs = imgs
  ret.lvStat = getStat($)
  ret.talent = {
    a: getTalents($, 'icons/talent-a', 0),
    e: getTalents($, 'icons/talent-e', 1),
    q: getTalents($, 'icons/talent-q', name === '莫娜' || name === '神里绫华' ? 3 : 2)
  }
  ret.passive = getPassive($, name)
  ret.cons = getCons($)
  getImgs($)
  return {
    data: ret,
    imgs
  }
}

async function saveCharData (id, key) {
  if (!id || !key) {
    return
  }
  let { data, imgs } = await getCharData(id, key)
  let name = data.name

  if (!name) {
    console.log(`角色名不存在${id}:${key}`)
    return
  }

  let charPath = `${_path}/plugins/miao-plugin/resources/meta/character/${data.name}/`
  if (!fs.existsSync(charPath)) {
    fs.mkdirSync(charPath)
  }
  let iconPath = charPath + 'icons'
  if (!fs.existsSync(iconPath)) {
    fs.mkdirSync(iconPath)
  }
  let imgPath = charPath + 'imgs'
  if (!fs.existsSync(imgPath)) {
    fs.mkdirSync(imgPath)
  }

  fs.writeFileSync(`${charPath}data.json`, JSON.stringify(data, '', '\t'))
  console.log(data.name + '数据下载完成')
  await imgs.download()
  console.log(data.name + '图像全部下载完成')
}

const charData = {
  67: 'collei',
  68: 'dori',
  69: 'tighnari',
  70: 'nilou',
  71: 'cyno',
  72: 'candace'
}

async function down (name = '') {
  if (name === '') {
    name = lodash.values(charData).join(',')
  }
  let names = name.split(',')
  for (let id in charData) {
    let key = charData[id]
    if (!names.includes(key)) {
      continue
    }
    await saveCharData(id, key)
  }
}

await down()
