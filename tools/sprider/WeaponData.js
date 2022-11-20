import lodash from 'lodash'

const WeaponData = {
  getBasic ($, id) {
    let ret = {}
    let basic = $('.genshin_table.main_table:first')
    let title = function (title) {
      return basic.find(`td:contains('${title}'):last`).next('td').text().trim()
    }
    ret.affixTitle = title('Weapon Affix')
    ret.star = basic.find('td:contains(\'Rarity\')').next('td').find('.cur_icon').length
    ret.desc = title('Description')
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
      Elec: 'dmg',
      Heal: 'heal',
      Phys: 'phy'
    }
    stat.find('tr:first td:lt(8)').each(function (i) {
      let title = $(this).text()
      let titleRet = /^Bonuse?\s(\w+)%*$/.exec(title)
      if (titleRet && titleRet[1]) {
        attrs.push(bonusMap[titleRet[1]] || titleRet[1])
        colIdxs[i] = bonusMap[titleRet[1]] || titleRet[1]
      } else if (titleMap[title]) {
        attrs.push(titleMap[title])
        colIdxs[i] = titleMap[title]
      }
    })
    let lvs = []
    let atkBase = {}
    let bonusAttr = {}
    stat.find('tr:gt(0)').each(function (i) {
      let tr = $(this)
      let lvl = tr.find('td:first').text()
      lvs.push(lvl)
      tr.find('td:lt(8)').each(function (i) {
        let title = colIdxs[i]
        if (!title) {
          return
        }
        if (title === 'atkBase') {
          atkBase[lvl] = $(this).text().trim('%') * 1
        } else {
          bonusAttr[lvl] = $(this).text().trim('%') * 1
        }
      })
    })

    return {
      atk: atkBase,
      bonusKey: attrs[1],
      bonusData: bonusAttr
    }
  },

  getDetail ($, { id, name }, mData) {
    let attr = WeaponData.getDetailAttr($)
    let materials = WeaponData.getMaterials($, mData)
    let affixData = WeaponData.getAffix($, name)
    console.log(affixData)
    return {
      id,
      name,
      ...WeaponData.getBasic($),
      attr,
      materials,
      affixData
    }
  },

  // 获取正文
  getDesc (dt) {
    dt = dt || ''
    dt = dt.replace(/<color=[^>]*>/g, '')
    dt = dt.replace(/<\/color=[^>]*>/g, '')
    dt = dt.replace(/<span class=[^>]*>/g, '<strong>')
    dt = dt.replace(/<\/span>/g, '</strong>')
    dt = dt.replace(/<[^>]*>/g, '')
    dt = dt.replace(/<\/[^>]*>/g, '')
    dt = dt.split('<br>')
    let desc = []
    let isEmpty = true
    lodash.forEach(dt, (txt, i) => {
      txt = lodash.trim(txt)
      if (!txt) {
        isEmpty = true
        return
      } else if (txt.length < 15 && isEmpty) {
        txt = `${txt}`
      }
      desc.push(txt)
      isEmpty = false
    })
    return desc
  },

  // 获取素材
  getMaterials ($, mData) {
    let basic = $('.genshin_table.main_table')
    let ret = {}
    lodash.forEach([{
      title: 'Weapon Ascension Materials',
      keys: 'weapon,monster,normal,weapon,monster,normal,weapon,monster,normal,weapon',
      group: { weapon: 9, monster: 7, normal: 8 }
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
            temp[key] = temp[key] || {}
            temp[key][name] = ds
            if (group[key] === idx) {
              mData[name] = {
                id,
                name,
                type: key,
                star,
                items: temp[key]
              }
              temp[key] = {}
            }
          } else {
            mData[name] = ds
          }
        }
      })
    })
    return ret
  },
  getAffix ($, name) {
    let affix = {}
    let cont = $('.genshin_table.affix_table tr:gt(0)')
    cont.each(function () {
      let tr = $(this)
      affix[tr.find('td:first').text()] = WeaponData.getDesc(tr.find('td:eq(1)').text()).join('')
    })
    if (name === '白铁大剑') {
      console.log(affix)
    }
    let tmpl = []
    lodash.forEach(affix, (txt) => {
      let tpls = txt.match(/([^\d]+)([/\d% \\.]+|$)/g)
      lodash.forEach(tpls, (tpl, idx) => {
        let test = /^([^\d/%]+)([/\d% \\.]*)$/.exec(tpl)
        if (test) {
          if (!tmpl[idx]) {
            tmpl[idx] = {
              txt: test[1],
              data: [test[2]]
            }
          } else {
            if (test[1] !== tmpl[idx].txt) {
              console.log('error:', tmpl[idx].txt, test[1], tpl)
            }
            tmpl[idx].data.push(test[2])
          }
        } else {
          console.log('error')
        }
      })
    })
    let tpls = []
    let datas = {}
    let idx = 0
    lodash.forEach(tmpl, (ds) => {
      let { txt, data } = ds
      let isSame = true
      for (let v of data) {
        if (v !== data[0]) {
          isSame = false
        }
      }
      if (isSame) {
        tpls.push(`${txt}${data[0]}`)
      } else {
        tpls.push(`${txt}$[${idx}]`)
        datas[idx] = data
        idx++
      }
    })
    return {
      text: tpls.join(''),
      datas
    }
  }
}
export default WeaponData
