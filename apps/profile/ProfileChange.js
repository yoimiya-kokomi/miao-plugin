/**
 * 面板数据替换相关逻辑
 */
import lodash from 'lodash'
import { Data, Meta } from '#miao'
import { Character, ArtifactSet, Avatar, Weapon, Player } from '#miao.models'

// 默认武器
let defWeapon = {
  bow: '西风猎弓',
  catalyst: '西风秘典',
  claymore: '西风大剑',
  polearm: '西风长枪',
  sword: '西风剑'
}

const ProfileChange = {
  /**
   * 匹配消息
   * @param msg
   * @returns {{}}
   */
  matchMsg (msg) {
    if (!/(变|改|换)/.test(msg)) {
      return false
    }
    msg = msg.toLowerCase().replace(/uid ?:? ?/, '').replace('', '')
    let regRet = /^#*(\d{9})?(.+?)(详细|详情|面板|面版|圣遗物|伤害[1-7]?)?\s*(\d{9})?[变换改](.+)/.exec(msg)
    if (!regRet || !regRet[2]) {
      return false
    }
    let ret = {}
    let change = {}
    let char = Character.get(lodash.trim(regRet[2]).replace('星铁', ''))
    if (!char) {
      return false
    }
    const game = char.game
    const isGs = game === 'gs'
    const keyMap = isGs
      ? {
          artis: '圣遗物',
          arti1: '花,生之花',
          arti2: '毛,羽,羽毛,死之羽',
          arti3: '沙,沙漏,表,时之沙',
          arti4: '杯,杯子,空之杯',
          arti5: '头,冠,理之冠,礼冠,帽子,帽',
          weapon: '武器'
        }
      : {
          artis: '圣遗物,遗器',
          arti1: '头,帽子,头部',
          arti2: '手,手套,手部',
          arti3: '衣,衣服,甲,躯干,',
          arti4: '鞋,靴,鞋子,靴子,脚,脚部',
          arti5: '球,位面球',
          arti6: '绳,线,链接绳,连接绳',
          weapon: '武器,光锥'
        }
    let keyTitleMap = {}
    lodash.forEach(keyMap, (val, key) => {
      lodash.forEach(val.split(','), (v) => {
        keyTitleMap[v] = key
      })
    })
    const keyReg = new RegExp(`^(\\d{9})?\\s*(.+?)\\s*(\\d{9})?\\s*((?:${lodash.keys(keyTitleMap).join('|')}|\\+)+)$`)

    ret.char = char.id
    ret.mode = regRet[3] === '换' ? '面板' : regRet[3]
    ret.uid = regRet[1] || regRet[4] || ''
    ret.game = char.game
    msg = regRet[5]

    // 更换匹配
    msg = msg.replace(/[变改]/g, '换')
    lodash.forEach(msg.split('换'), (txt) => {
      txt = lodash.trim(txt)
      if (!txt) {
        return true
      }
      // 匹配圣遗物
      let keyRet = keyReg.exec(txt)
      if (keyRet && keyRet[4]) {
        let char = Character.get(lodash.trim(keyRet[2]))
        if (char) {
          if (char.game !== game) {
            return true
          }
          lodash.forEach(keyRet[4].split('+'), (key) => {
            key = lodash.trim(key)
            let type = keyTitleMap[key]
            change[type] = {
              char: char.id || '',
              uid: keyRet[1] || keyRet[3] || '',
              type
            }
          })
        } else if (keyRet[4].length > 2) {
          return true
        }
      }

      // 匹配圣遗物套装
      let asMap = Meta.getAlias(game, 'artiSet')
      let asKey = asMap.sort((a, b) => b.length - a.length).join('|')
      let asReg = new RegExp(`^(${asKey})套?[2,4]?\\+?(${asKey})?套?[2,4]?\\+?(${asKey})?套?[2,4]?$`)
      let asRet = asReg.exec(txt)
      let getSet = (idx) => {
        let set = ArtifactSet.get(asRet[idx])
        return set ? set.name : false
      }
      if (asRet && asRet[1] && getSet(1)) {
        if (game === 'gs') {
          change.artisSet = [getSet(1), getSet(2) || getSet(1)]
        } else if (game === 'sr') {
          for (let idx = 1; idx <= 3; idx++) {
            let as = ArtifactSet.get(asRet[idx])
            if (as) { // 球&绳
              change.artisSet = change.artisSet || []
              let ca = change.artisSet
              ca[as.idxs?.[1] ? (ca[0] ? 1 : 0) : 2] = as.name
            }
          }
          let ca = change.artisSet
          if (ca && ca[0] && !ca[1]) {
            ca[1] = ca[0]
          }
        }
        return true
      }

      // 匹配武器
      let wRet = /^(?:等?级?([1-9][0-9])?级?)?\s*(?:([1-5一二三四五满])?精炼?([1-5一二三四五])?)?\s*(?:等?级?([1-9][0-9])?级?)?\s*(.*)$/.exec(txt)
      if (wRet && wRet[5]) {
        let weaponName = lodash.trim(wRet[5])
        let weapon = Weapon.get(weaponName, game, ret.char.game)
        if (weapon || weaponName === '武器' || Weapon.isWeaponSet(weaponName)) {
          let affix = wRet[2] || wRet[3]
          affix = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 满: 5 }[affix] || affix * 1
          let tmp = {
            weapon: (Weapon.isWeaponSet(weaponName) ? weaponName : weapon?.name) || '',
            affix: affix || '',
            level: wRet[1] * 1 || wRet[4] * 1 || ''
          }
          if (lodash.values(tmp).join('')) {
            change.weapon = tmp
          }
          return true
        }
      }
      let char = change.char || {}
      // 命座匹配
      let consRet = /([0-6零一二三四五六满])(命|魂|星魂)/.exec(txt)
      if (consRet && consRet[1]) {
        let cons = consRet[1]
        char.cons = Math.max(0, Math.min(6, lodash.isNaN(cons * 1) ? '零一二三四五六满'.split('').indexOf(cons) : cons * 1))
        txt = txt.replace(consRet[0], '')
      }

      // 天赋匹配
      let talentRet = (isGs
        ? /(?:天赋|技能|行迹)((?:[1][0-5]|[1-9])[ ,]?)((?:[1][0-5]|[1-9])[ ,]?)([1][0-5]|[1-9])/
        : /(?:天赋|技能|行迹)((?:[1][0-5]|[1-9])[ ,]?)((?:[1][0-5]|[1-9])[ ,]?)((?:[1][0-5]|[1-9])[ ,]?)([1][0-5]|[1-9])/).exec(txt)
      if (talentRet) {
        char.talent = {}
        lodash.forEach((isGs ? 'aeq' : 'aetq').split(''), (key, idx) => {
          char.talent[key] = talentRet[idx + 1] * 1 || 1
        })
        txt = txt.replace(talentRet[0], '')
      }

      let lvRet = /等级([1-9][0-9]?)|([1-9][0-9]?)级/.exec(txt)
      if (lvRet && (lvRet[1] || lvRet[2])) {
        char.level = (lvRet[1] || lvRet[2]) * 1
        txt = txt.replace(lvRet[0], '')
      }
      txt = lodash.trim(txt)
      if (txt) {
        let chars = Character.get(txt)
        if (chars && (chars.game === game)) {
          char.char = chars.id
        }
      }
      if (!lodash.isEmpty(char)) {
        change.char = char
      }
    })
    ret.change = lodash.isEmpty(change) ? false : change
    return ret
  },

  /**
   * 获取面板数据
   * @param uid
   * @param charid
   * @param ds
   * @param game
   * @returns {Avatar|boolean}
   */
  getProfile (uid, charid, ds, game = 'gs') {
    if (!charid) {
      return false
    }

    const isGs = game === 'gs'

    let player = Player.create(uid, game)

    let source = player.getProfile(charid)
    let dc = ds.char || {}
    if (!source || !source.hasData) {
      source = {}
    }

    let char = Character.get(dc?.char || source.id || charid)
    if (!char) {
      return false
    }
    let level = dc.level || source.level || 90
    let promote = level === source.level ? source.promote : undefined

    let profiles = {}
    if (source && source.id) {
      profiles[`${player.uid}:${source.id}`] = source
    }
    // 获取source
    let getSource = function (cfg) {
      if (!cfg || !cfg.char) {
        return source
      }
      let cuid = cfg.uid || uid
      let id = cfg.char || source.id
      let key = cuid + ':' + id
      if (!profiles[key]) {
        let cPlayer = Player.create(cuid, game)
        profiles[key] = cPlayer.getProfile(id) || {}
      }
      return profiles[key]?.id ? profiles[key] : source
    }
    // 初始化profile
    let ret = new Avatar({
      uid,
      id: char.id,
      level,
      cons: Data.def(dc.cons, source.cons, 0),
      fetter: source.fetter || 10,
      elem: source.char?.elem || char.elem,
      dataSource: 'change',
      _source: 'change',
      promote,
      trees: lodash.extend([], source.trees)
    }, char.game)

    // 设置武器
    let wCfg = ds.weapon || {}
    let wSource = getSource(wCfg).weapon || {}
    let weapon = Weapon.get(wCfg?.weapon || wSource?.name || defWeapon[char.weaponType], char.game, char.weaponType)
    if (char.isGs) {
      if (!weapon || weapon.type !== char.weaponType) {
        weapon = Weapon.get(defWeapon[char.weaponType], char.game)
      }
    }

    let wDs = {
      name: weapon.name,
      star: weapon.star,
      level: Math.min(weapon.maxLv || 90, wCfg.level || wSource.level || 90)
    }
    if (wSource.level === wDs.level) {
      wDs.promote = wSource.promote
    }
    wDs.affix = Math.min(weapon.maxAffix || 5, wCfg.affix || ((wDs.star === 5 && wSource.star !== 5) ? 1 : (wSource.affix || 5)))
    ret.setWeapon(wDs)

    // 设置天赋
    if (ds?.char?.talent) {
      ret.setTalent(ds?.char?.talent, 'level')
    } else {
      ret.setTalent(source?.originalTalent || (isGs ? { a: 9, e: 9, q: 9 } : { a: 6, e: 8, t: 8, q: 8 }), 'original')
    }

    // 设置圣遗物
    let artis = getSource(ds.artis)?.artis?.toJSON() || {}
    for (let idx = 1; idx <= (isGs ? 5 : 6); idx++) {
      if (ds['arti' + idx]) {
        let source = getSource(ds['arti' + idx])
        if (source && source.artis && source.artis[idx]) {
          artis[idx] = source.artis[idx]
        }
      }
      let artisIdx = (isGs ? '00111' : '001122')[idx - 1]
      if (artis[idx] && ds.artisSet && ds.artisSet[artisIdx]) {
        let as = ArtifactSet.get(ds.artisSet[artisIdx], game)
        if (as) {
          artis[idx].id = as.getArti(idx)?.getIdByStar(artis[idx].star || 5)
          artis[idx].name = as.getArtiName(idx)
          artis[idx].set = as.name
        }
      }
    }
    ret.setArtis(artis)
    ret.calcAttr()
    return ret
  }
}
export default ProfileChange
