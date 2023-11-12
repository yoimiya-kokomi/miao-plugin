import { Cfg, Data } from '#miao'

let { diyCfg } = await Data.importCfg('profile')
import ProfileServ from './ProfileServ.js'
import ProfileReq from './ProfileReq.js'

import enkaApi from './api/EnkaApi.js'
import miaoApi from './api/MiaoApi.js'
import mggApi from './api/MggApi.js'
import hutaoApi from './api/HutaoApi.js'
import homoApi from './api/HomoApi.js'
import avocadoApi from './api/AvocadoApi.js'
import enkaHSRApi from './api/EnkaHSRApi.js'

const apis = {
  miao: miaoApi,
  mgg: mggApi,
  enka: enkaApi,
  hutao: hutaoApi,
  homo: homoApi,
  avocado: avocadoApi,
  enkaHSR: enkaHSRApi
}

const servs = {}

const Serv = {
  // 根据UID获取 ProfileServ
  getServ (uid, game = 'gs') {
    let token = diyCfg?.miaoApi?.token
    let qq = diyCfg?.miaoApi?.qq
    let hasToken = !!(qq && token && token.length === 32 && !/^test/.test(token))
    let isGs = game === 'gs'

    // 根据uid判断当前服务器类型。官服0 B服1 国际2
    let servType = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 1, 6: 2, 7: 2, 8: 2, 9: 2 }[uid[0]]

    // 获取原神、星铁对应服务选择的配置
    let servCfg = (Cfg.get(isGs ? 'profileServer' : 'srProfileServer', '0') || '0').toString()
    let servIdx = servCfg[servType] || servCfg[0] || '0'

    // 设置为自动或1时，如果具备token则使用miao
    if ((servIdx === '0' || servIdx === '1') && hasToken) {
      return Serv.serv('miao')
    }

    // 如果指定了序号，则返回对应服务。0和1已前置判断
    // 原神：0自动，1喵，2Enka，3Mgg, 4:Hutao
    // 星铁：0自动，1喵，2Mihomo，3Avocado, 4EnkaHSR
    let servKey = isGs ? {
      2: 'enka',
      3: 'mgg',
      4: 'hutao'
    } : {
      2: 'homo',
      3: 'avocado',
      4: 'enkaHSR'
    }
    if (servKey[servIdx]) {
      return Serv.serv(servKey[servIdx])
    }

    // 设置为0或无token，使用返回默认的serv。官服0 B服1 国际2
    let defServKey = isGs ? ['mgg', 'mgg', 'enka'] : ['homo', 'homo', 'homo']
    return Serv.serv(defServKey[servType])
  },

  // 根据key获取ProfileServ
  serv (key) {
    if (!servs[key]) {
      servs[key] = new ProfileServ(apis[key])
    }
    return servs[key]
  },

  // 发起请求
  async req (e, player) {
    let req = ProfileReq.create(e, player.game)
    if (!req) {
      return false
    }
    let serv = Serv.getServ(e.uid || player.uid, player.game)
    let { uid } = player
    try {
      player._update = []
      await req.requestProfile(player, serv, player.game)
      return player._update?.length || 0
    } catch (err) {
      if (!e._isReplyed) {
        e.reply(`UID:${uid}更新面板失败，更新服务：${serv.name}`)
      }
      console.log(err)
      return false
    }

  }
}

export default Serv
