import { ProfileReq, ProfileServ } from '../index.js'
import { Cfg, Data } from '../../components/index.js'

import enkaCfg from './EnkaApi.js'
import MiaoApi from './MiaoApi.js'

let { diyCfg } = await Data.importCfg('profile')

const Profile = {
  /**
   * 根据UID分配请求服务器
   * @param uid
   * @returns {ProfileServ}
   */
  getServ (uid) {
    let token = diyCfg?.miaoApi?.token
    let qq = diyCfg?.miaoApi?.qq

    if (qq && token && token.length === 32 && !/^test/.test(token) && Cfg.get('profileServ') === 1) {
      if (!Profile.Miao) {
        Profile.Miao = new ProfileServ(MiaoApi)
      }
      return Profile.Miao
    }
    if (!Profile.Enka) {
      Profile.Enka = new ProfileServ(enkaCfg)
    }
    return Profile.Enka
  },

  /**
   * 更新面板数据
   * @param player
   * @param force
   * @returns {Promise<boolean|number>}
   */
  async refreshProfile (player, force = true) {
    player._update = []
    let { uid, e } = player
    if (uid.toString().length !== 9 || !e) {
      return false
    }
    let req = ProfileReq.create(e)
    if (!req) {
      return false
    }
    let serv = Profile.getServ(uid)
    try {
      await req.requestProfile(player, serv)
      player._profile = new Date() * 1
      player.save()
      return player._update.length
    } catch (err) {
      e.reply(`UID:${uid}更新面板失败，更新服务：${serv.name}`)
      return false
    }
  },

  isProfile (avatar) {
    // 检查数据源
    if (!avatar._source || !['enka', 'change', 'miao'].includes(avatar._source)) {
      return false
    }
    // 检查武器及天赋
    if (!avatar.weapon || !avatar.talent) {
      return false
    }
    // 检查圣遗物词条是否完备
    if (!avatar.artis || !avatar.artis.hasAttr) {
      return false
    }
    // 检查旅行者
    if (['空', '荧'].includes(avatar.name)) {
      return !!avatar.elem
    }
    return true
  }
}

export default Profile
