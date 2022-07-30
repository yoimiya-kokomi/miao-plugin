import fetch from 'node-fetch'
import lodash from 'lodash'
import Character from '../models/Character.js'
import moment from 'moment'
import { artiIdx, artiSetMap, attrMap } from './miao-meta.js'
import cmeta from './enka-char.js'

let Miao = {
  key: 'miao',
  cd: 1,
  async request ({ e, uid, avatar = '', diyCfg, sysCfg }) {
    let url = diyCfg?.miaoApi?.url || sysCfg.miaoApi.url
    let token = diyCfg?.miaoApi?.token || sysCfg.miaoApi.token
    let profileApi = diyCfg?.miaoApi?.listApi || sysCfg.miaoApi.listApi
    let api = profileApi({ url, uid, avatar, token })
    let data
    let req = await fetch(api)
    data = await req.json()
    if (data.status !== 0) {
      e.reply(data.msg || '请求失败')
      return false
    }
    if (!data.uidListData || data.uidListData.length === 0) {
      e.reply('请打开游戏内角色展柜的“显示详情”后，等待5分钟重新获取面板')
      return false
    }

    return Miao.getData(uid, data)
  },

  getData (uid, data) {
    let ret = {
      uid,
      chars: {}
    }

    lodash.forEach({
      name: 'nickname',
      // avatar: "profilePicture.avatarId",
      lv: 'level'
    }, (src, key) => {
      ret[key] = lodash.get(data, src, '')
    })
    lodash.forEach(data.uidListData, (ds) => {
      let char = Miao.getAvatar(ds)
      ret.chars[char.id] = char
    })
    return ret
  },

  getAvatar (ds) {
    let char = Character.get(ds.usernameid)
    let now = moment()
    return {
      id: ds.usernameid,
      name: char ? char.name : '',
      dataSource: 'miao-pre',
      updateTime: now.format('YYYY-MM-DD HH:mm:ss'),
      lv: ds.level
    }
  },

  async getCharData (uid, ds, saveCharData, { diyCfg = {}, sysCfg = {} }) {
    if (ds.dataSource !== 'miao-pre' || !ds.id) {
      return ds
    }
    try {
      let url = diyCfg?.miaoApi?.url || sysCfg.miaoApi.url
      let token = diyCfg?.miaoApi?.token || sysCfg.miaoApi.token
      let profileApi = diyCfg?.miaoApi?.detailApi || sysCfg.miaoApi.detailApi
      let api = profileApi({ url, token, uid, avatar: ds.id })
      let req = await fetch(api)
      let data = await req.json()
      if (data.status === 0 && data.uidData) {
        data = Miao.getAvatarDetail(data)
        if (data) {
          saveCharData(uid, data)
          return data
        }
      }
      return ds
    } catch (err) {
      console.log(err)
      return ds
    }
  },
  getAvatarDetail (data) {
    let ds = data.uidData
    let char = Character.get(ds.id)
    let now = moment()
    return {
      id: ds.id,
      name: char ? char.name : '',
      dataSource: 'miao',
      updateTime: now.format('YYYY-MM-DD HH:mm:ss'),
      lv: ds.level,
      fetter: ds.fetterLevel,
      attr: Miao.getAttr(data.uidDataCombatValue),
      weapon: Miao.getWeapon(ds.weapon),
      artis: Miao.getArtifact(data.uidDataByReliquary),
      cons: ds.constellationNum || 0,
      talent: Miao.getTalent(char.id, ds.skill),
      _priority: 10
    }
  },
  getAttr (data) {
    let ret = {}
    lodash.forEach({
      atk: 'attack',
      atkBase: 'baseATK',
      hp: 'health',
      hpBase: 'baseHP',
      def: 'defense',
      defBase: 'baseDEF',
      mastery: 'elementMastery',
      cRate: {
        src: 'critRate',
        pct: true
      },
      cDmg: {
        src: 'critDamage',
        pct: true
      },
      hInc: {
        src: 'heal',
        pct: true
      },
      recharge: {
        src: 'recharge',
        pct: true
      }
    }, (cfg, key) => {
      if (!lodash.isObject(cfg)) {
        cfg = { src: cfg }
      }
      let val = data[cfg.src] || 0
      if (cfg.pct) {
        val = val * 100
      }
      ret[key] = val
    })
    let maxDmg = 0;
    let hurt = data.addHurt || {}
    lodash.forEach('fire,elec,water,grass,wind,rock,ice'.split(','), (key) => {
      maxDmg = Math.max(hurt[key] * 100, maxDmg)
    })
    ret.dmgBonus = maxDmg
    ret.phyBonus = hurt.physical * 100
    return ret
  },
  getWeapon (weapon) {
    return {
      name: weapon.name,
      star: weapon.rank,
      level: weapon.level,
      promote: weapon.promoteLevel,
      affix: (weapon.affixLevel || 0) + 1
    }
  },
  getArtifact (data) {
    let ret = {}
    let get = function (d) {
      if (!d) {
        return []
      }
      let name = d.name
      name = name.replace('FIGHT_PROP_', '')
      if (!attrMap[name]) {
        return []
      }
      let value = d.value
      if (value && value < 1) {
        value = value * 100
      }
      return [attrMap[name], value]
    }

    lodash.forEach(data, (ds) => {
      let sub = ds.appendAffix || []
      let idx = artiIdx[ds.type]
      if (!idx) {
        return
      }
      ret[`arti${idx}`] = {
        name: ds.name,
        set: artiSetMap[ds.name] || '',
        level: ds.level,
        main: get(ds.mainAffix),
        attrs: [
          get(sub[0]),
          get(sub[1]),
          get(sub[2]),
          get(sub[3])
        ]
      }
    })
    return ret
  },
  getTalent (charid, data = {}) {
    let cm = cmeta[charid] || {}
    let cn = cm.Skills || {}
    let idx = 1
    let idxMap = { 0: 'a', 1: 'e', 2: 'q', a: 'a', s: 'e', e: 'q' }
    lodash.forEach(cn, (n, id) => {
      let nRet = /skill_(\w)/.exec(n.toLowerCase())
      idxMap[id] = nRet && nRet[1] ? idxMap[nRet[1]] : idxMap[idx]
      idx++
    })

    let ret = {}
    lodash.forEach(data, (ds) => {
      let key = idxMap[ds.id]
      ret[key] = {
        level_original: ds.level,
        level_current: ds.level
      }
    })
    return ret
  }
}

export default Miao
