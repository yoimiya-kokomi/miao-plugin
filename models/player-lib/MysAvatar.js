import lodash from 'lodash'
import { Common, Data } from '../../components/index.js'

const MysAvatar = {
  /**
   * 更新米游社角色信息
   * @param player
   * @param mys
   * @param force
   * @returns {Promise<boolean>}
   */
  async refreshMysAvatar (player, force = false) {
    let mys = player?.e?._mys
    if (!mys) {
      return false
    }
    // 不必要更新
    if ((new Date() * 1 - player._mys < 10 * 60 * 1000) && !force) {
      return false
    }
    let charData = await mys.getCharacter()
    if (!charData || !charData.avatars) {
      return false
    }
    MysAvatar.setMysCharData(player, charData)
  },

  /**
   * 更新米游社统计信息
   * @param player
   * @param force
   * @returns {Promise<boolean>}
   */
  async refreshMysInfo (player, force = false) {
    let mys = player?.e?._mys
    if (!mys) {
      return false
    } // 不必要更新
    if (player._info && (new Date() * 1 - player._info < 10 * 60 * 1000) && !force) {
      return false
    }
    let infoData = await mys.getIndex()
    if (!infoData) {
      return false
    }
    MysAvatar.setMysInfo(player, infoData)
  },

  /**
   * 根据已有Mys CharData更新player
   * @param player
   * @param charData
   */
  setMysCharData (player, charData) {
    let role = charData.role
    player.setBasicData({
      level: role.level,
      name: role.nickname
    })
    lodash.forEach(charData.avatars, (ds) => {
      let avatar = Data.getData(ds, 'id,level,cons:actived_constellation_num,fetter')
      avatar.elem = ds.element.toLowerCase()
      // 处理时装数据
      let costume = (ds?.costumes || [])[0]
      if (costume && costume.id) {
        avatar.costume = costume.id
      }
      avatar.weapon = Data.getData(ds.weapon, 'name,star:rarity,level,promote:promote_level,affix:affix_level')
      // 处理圣遗物数据
      let artis = {}
      lodash.forEach(ds.reliquaries, (re) => {
        const posIdx = { 生之花: 1, 死之羽: 2, 时之沙: 3, 空之杯: 4, 理之冠: 5 }
        if (re && re.name && posIdx[re.pos_name]) {
          artis[posIdx[re.pos_name]] = {
            name: re.name,
            level: re.level
          }
        }
      })
      avatar.artis = artis
      player.setAvatar(avatar, 'mys')
    })
    player._mys = new Date() * 1
    player.save()
  },

  setMysInfo (player, infoData) {
    let role = infoData.role
    // 设置角色信息
    let homeLevel = ((infoData?.homes || [])[0])?.level
    if(role) {
      player.setBasicData({
        level: role.level,
        name: role.nickname
      })
    }
    // 设置角色数据
    lodash.forEach(infoData?.avatars || [], (ds) => {
      let avatar = Data.getData(ds, 'id,level,cons:actived_constellation_num,fetter')
      avatar.elem = ds.element.toLowerCase()
      player.setAvatar(avatar, 'mys')
    })
    let stats = {}
    lodash.forEach(infoData?.stats || [], (num, key) => {
      key = key.replace('_number', '')
      if (key !== 'spiral_abyss') {
        stats[lodash.camelCase(key)] = num
      }
    })

    let exploration = {}
    lodash.forEach(infoData?.world_explorations || [], (ds) => {
      let { name } = ds
      if (name === '层岩巨渊') {
        return true
      }
      exploration[name === '层岩巨渊·地下矿区' ? '层岩巨渊' : name] = ds.exploration_percentage
    })
    player.info = {
      homeLevel,
      stats,
      exploration
    }
    player._info = new Date() * 1
    player.save()
  },

  /**
   * 获取当前角色需要更新天赋的角色ID
   * @param player
   * @param ids 角色列表，若传入则查询指定角色列表，不传入查询全部
   * @returns {*[]}
   */
  getNeedRefreshIds (player, ids) {
    let ret = []
    if (!ids) {
      ids = lodash.keys(player._avatars)
    } else if (!lodash.isArray(ids)) {
      ids = [ids]
    }
    lodash.forEach(ids, (id) => {
      let avatar = player.getAvatar(id)
      if (avatar.needRefreshTalent) {
        ret.push(avatar.id)
      }
    })
    return ret
  },

  /**
   * 使用MysApi刷新指定角色的天赋信息
   * @param player
   * @param ids
   * @param force
   * @returns {Promise<boolean>}
   */
  async refreshTalent (player, ids, force) {
    let e = player?.e
    let mys = e?._mys
    if (!e || !mys) {
      return false
    }
    let needReqIds = MysAvatar.getNeedRefreshIds(player, ids)
    if (needReqIds.length > 0) {
      if (needReqIds.length > 8) {
        e && e.reply('正在获取角色信息，请稍候...')
      }
      let num = 10
      let ms = 100
      let skillRet = []
      let avatarArr = lodash.chunk(needReqIds, num)
      for (let val of avatarArr) {
        for (let id of val) {
          let avatar = player.getAvatar(id)
          skillRet.push(await MysAvatar.refreshAvatarTalent(avatar, mys))
        }
        skillRet = await Promise.all(skillRet)
        skillRet = skillRet.filter(item => item.id)
        await Common.sleep(ms)
      }
    }
    player.save()
  },

  async refreshAvatarTalent (avatar, mys) {
    if (mys && mys.isSelfCookie) {
      let char = avatar.char
      if (!char) {
        return false
      }
      let id = char.id
      let talent = {}
      let talentRes = await mys.getDetail(id)
      // { data: null, message: '请先登录', retcode: -100, api: 'detail' }
      if (talentRes && talentRes.skill_list) {
        let talentList = lodash.orderBy(talentRes.skill_list, ['id'], ['asc'])
        for (let val of talentList) {
          let { max_level: maxLv, level_current: lv } = val
          if (val.name.includes('普通攻击')) {
            talent.a = lv
            continue
          }
          if (maxLv >= 10 && !talent.e) {
            talent.e = lv
            continue
          }
          if (maxLv >= 10 && !talent.q) {
            talent.q = lv
          }
        }
      }
      let ret = char.getAvatarTalent(talent, avatar.cons, 'original')
      if (ret) {
        avatar.setTalent(ret, 'original', 'mys')
      }
      return true
    }
    return false
  }
}
export default MysAvatar
