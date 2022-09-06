import { abbr } from '../../../../config/genshin/roleId.js'
import lodash from 'lodash'

let costumes = {
  琴: [200301], // 琴
  芭芭拉: [201401], // 芭芭拉
  刻晴: [204201], // 刻晴
  凝光: [202701], // 凝光
  迪卢克: [201601], // 迪卢克
  菲谢尔: [203101], // 菲谢尔
  达达利亚: [900001],
  雷电将军: [900002]
}
const fixData = {
  4: {
    id: 20000000,
    title: '异界的旅人'
  },
  5: {
    title: '异界的旅人',
    cncv: '鹿喑',
    jpcv: '堀江瞬'
  },
  7: {
    title: '异界的旅人',
    cncv: '多多poi',
    jpcv: '古贺葵'
  }
}

const CharData = {
  getBasic ($, id, name = '') {
    let ret = {}
    let fix = fixData[id] || {}
    ret.id = fix.id || 10000000 + id * 1
    let basic = $('.genshin_table.main_table')
    let title = function (title) {
      return basic.find(`td:contains('${title}')`).next('td').text().trim()
    }
    ret.name = name || title('Name')
    ret.abbr = abbr[ret.name] || ret.name
    ret.title = fix.title || title('Title')
    ret.star = basic.find('td:contains(\'Rarity\')').next('td').find('.cur_icon').length
    ret.elem = title('Element').toLowerCase()
    ret.allegiance = title('Occupation')
    ret.weapon = title('Weapon').toLowerCase()
    ret.birth = title('Month of Birth') + '-' + title('Day of Birth')
    ret.astro = title('Constellation')
    ret.desc = title('Description')
    ret.cncv = fix.cncv || title('Chinese')
    ret.jpcv = fix.jpcv || title('Japanese')
    ret.costume = costumes[ret.name] || false
    ret.ver = 1
    return ret
  },

  getDetailAttr ($) {
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
      Def: 'defPct',
      CritDMG: 'cdmg',
      CritRate: 'cpct',
      ER: 'recharge',
      EM: 'mastery',
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
      keys: attrs,
      details: lvStat
    }
  },

  getDetail ($, id, name, setIdx = '', elem = '') {
    let cont = setIdx ? $(`#skillset_${setIdx}`) : $('#char_skills')
    cont.imgs = $.imgs
    let iconPath = elem ? `${elem}/icons` : 'icons'
    let talent = CharData.getTalents($, cont, name, iconPath)
    let passive = CharData.getPassive($, cont, name, iconPath)
    let cons = CharData.getCons($, cont, iconPath)
    return {
      id,
      name,
      talent,
      cons,
      passive
    }
  },

  // 获取正文
  getDesc (dt) {
    dt = dt || ''
    dt = dt.replace(/<color=[^>]*>/g, '')
    dt = dt.replace(/<\/color=[^>]*>/g, '')
    dt = dt.replace(/<span class=[^>]*>/g, '<strong>')
    dt = dt.replace(/<\/span>/g, '</strong>')
    dt = dt.split('<br>')
    let desc = []
    let isEmpty = true
    lodash.forEach(dt, (txt, i) => {
      txt = lodash.trim(txt)
      if (!txt) {
        isEmpty = true
        return
      } else if (txt.length < 15 && isEmpty) {
        txt = `<h3>${txt}</h3>`
      }
      desc.push(txt)
      isEmpty = false
    })
    return desc
  },

  // 获取单个天赋数据
  getTalent ($, cont, imgKey, eq, onlyLv1 = false) {
    let info = cont.find(`.genshin_table.skill_table:eq(${eq})`)

    let name = info.find('tr:first td:eq(1)').text()
    let icon = info.find('tr:first td:first img').attr('src')
    let idRet = /s_(\d+)01.webp/.exec(icon)
    let id = 0
    if (idRet && idRet[1]) {
      id = idRet[1] * 1
    }
    $.imgs.add(imgKey, icon)

    // 说明
    let desc = CharData.getDesc(info.find('tr:eq(1) td').html())

    // detail
    let detail = cont.find(`.genshin_table.skill_dmg_table:eq(${eq})`)
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
      let values2 = []
      let isSame = true
      let unit = ''
      $(this).find('td:gt(0)').each(function (i) {
        if (onlyLv1 && i > 0) {
          return false
        }
        let val = lodash.trim($(this).text())
        let v = val.replace(/(生命值上限|最大生命值)/, 'HP')
        v = v.replace(/(防御力)/, '防御')
        values.push(v)
        if (i > 0 && values[0] !== val) {
          isSame = false
        }
        let ur = /^(.*)(生命值上限|防御力|最大生命值|攻击力|生命值上限 \/ 层|当前生命值| \/ 层)(\s*\*\s*\d)?$/.exec(val)
        if (ur && ur[1] && ur[2]) {
          values2.push(ur[1] + (ur[3] || ''))
          unit = ur[2]
        } else {
          ur = /^(每点元素能量|每个猫爪|每朵|每个)(.*)$/.exec(val)
          if (ur && ur[1] && ur[2]) {
            values2.push(ur[2])
            unit = ur[1]
          } else {
            ur = /^(每层)(.*)(攻击力)$/.exec(val)
            if (ur && ur[1] && ur[2] && ur[3]) {
              values2.push(ur[2])
              unit = ur[1] + ' ' + ur[3]
            } else {
              unit = ''
            }
          }
        }
      })

      details.push({
        name,
        unit,
        isSame,
        values: unit ? values2 : values
      })
    })

    return {
      id,
      name,
      desc,
      tables: details
    }
  },

  // 获取天赋
  getTalents ($, cont, name, iconPath) {
    return {
      a: CharData.getTalent($, cont, `${iconPath}/talent-a`, 0),
      e: CharData.getTalent($, cont, `${iconPath}/talent-e`, 1),
      q: CharData.getTalent($, cont, `${iconPath}/talent-q`, name === '莫娜' || name === '神里绫华' ? 3 : 2)
    }
  },

  // 获取被动天赋
  getPassive ($, cont, name, iconPath) {
    let tables = cont.find('span.delim h3:contains("Passive Skills")').parent().nextUntil('span.delim')
    let ret = []
    tables.each(function () {
      let ds = {}
      $.imgs.add(`${iconPath}/passive-${ret.length}`, $(this).find('img').attr('src'))
      ds.name = $(this).find('tr:first td:eq(1)').text()
      ds.desc = CharData.getDesc($(this).find('tr:eq(1) td:first').html())
      ret.push(ds)
    })
    if (name === '莫娜' || name === '神里绫华') {
      ret.push(CharData.getTalent($, cont, `${iconPath}/passive-${ret.length}`, 2, true))
    }
    return ret
  },

  // 获取命座数据
  getCons ($, cont, iconPath) {
    let tables = cont.find('span.delim h3:contains("Constellations")').parent().nextAll('.skill_table')
    let ret = {}
    tables.each(function (idx) {
      let ds = {}
      $.imgs.add(`${iconPath}/cons-${idx + 1}`, $(this).find('img').attr('src'))
      ds.name = $(this).find('tr:first td:eq(1)').text()
      ds.desc = CharData.getDesc($(this).find('tr:eq(1) td:first').html())
      ret[idx + 1] = ds
    })
    return ret
  },

  // 获取角色图片素材
  getImgs ($) {
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
      $.imgs.add('imgs/banner', `img/i_${$._nid}_back.webp`)
      $.imgs.add('imgs/card', `img/i_${$._nid}_profile.webp`)
    }
  },

  // 获取命座加成天赋
  getConsTalent (talent, cons) {
    if (!talent || !cons) {
      return { e: 3, q: 5 }
    }
    let e = talent.e.name
    let q = talent.q.name
    let c3 = (cons['3']?.desc || []).join('')
    let c5 = (cons['5']?.desc || []).join('')
    return {
      e: c3.includes(e) ? 3 : 5,
      q: c5.includes(q) ? 5 : 3
    }
  },

  // 获取素材
  getMaterials ($, mData) {
    let basic = $('.genshin_table.main_table')
    let ret = {}
    lodash.forEach([{
      title: 'Character Ascension Materials',
      keys: 'gem,gem,gem,gem,boss,specialty,normal,normal,normal',
      group: { gem: 3, normal: 8 }
    }, {
      title: 'Skill Ascension Materials',
      keys: 'talent,talent,talent,weekly',
      group: { talent: 2 }
    }], ({ title, keys, group }) => {
      let imgs = basic.find(`td:contains('${title}')`).next('td').find('a')
      keys = keys.split(',')
      let temp = {}
      imgs.each(function (idx) {
        let key = keys[idx]
        if (key) {
          let a = $(this)
          let img = $(this).find('img')
          let name = img.attr('alt')
          let idRet = /i_([n\d]+)\//.exec(a.attr('href')) || []
          let starRet = /rar_bg_(\d)/.exec(a.find('>div').attr('class'))
          let id = idRet[1] || 0
          id = id[0] === 'n' ? id : id * 1
          let star = starRet[1] * 1 || 0
          if (id) {
            $.imgs.add2(name, key, `img/i_${id}.webp`)
          } else {
            console.log('fail', a.attr('href'))
          }
          ret[key] = name
          let ds = {
            id,
            name,
            type: key,
            star
          }
          if (group[key]) {
            temp[name] = ds
            if (group[key] === idx) {
              mData[name] = {
                id,
                name,
                type: key,
                star,
                items: temp
              }
              temp = {}
            }
          } else {
            mData[name] = ds
          }
        }
      })
    })
    return ret
  }
}
export default CharData
