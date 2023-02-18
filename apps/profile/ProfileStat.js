import { Common } from '../../components/index.js'
import { MysApi, Player, Character } from '../../models/index.js'

const ProfileStat = {
  async stat (e) {
    return ProfileStat.render(e, false)
  },

  async avatarList (e) {
    return ProfileStat.render(e, true)
  },
  async render (e, isAvatarList = false) {
    // 缓存时间，单位小时
    let msg = e.msg.replace('#', '').trim()
    if (msg === '角色统计' || msg === '武器统计') {
      // 暂时避让一下抽卡分析的关键词
      return false
    }

    let mys = await MysApi.init(e)
    if (!mys || !mys.uid) return false

    const uid = mys.uid

    let player = Player.create(e)

    let avatarRet = await player.refreshAndGetAvatarData({
      detail: 1,
      talent: isAvatarList ? 0 : 1,
      rank: true,
      retType: 'array',
      sort: true
    })

    if (avatarRet.length === 0) {
      e.reply(`暂未获得#${uid}角色数据，请绑定CK或 #更新面板`)
      return true
    }

    let talentNotice = []

    if (!mys.isSelfCookie) {
      talentNotice.push('未绑定CK，信息可能展示不完全')
    }

    let faceChar = Character.get(player.face || avatarRet[0]?.id)
    let face = {
      banner: faceChar.imgs?.banner,
      face: faceChar.imgs?.face,
      name: player.name || `#${uid}`,
      sign: player.sign,
      level: player.level
    }

    let info = player.getInfo()
    info.stats = info.stats || {}
    info.statMap = {
      achievement: '成就',
      wayPoint: '锚点',
      avatar: '角色',
      avatar5: '五星角色',
      goldCount: '金卡总数'
    }

    return await Common.render(isAvatarList ? 'character/avatar-list' : 'character/profile-stat', {
      save_id: uid,
      uid,
      info,
      updateTime: player.getUpdateTime(),
      isSelfCookie: e.isSelfCookie,
      face,
      avatars: avatarRet,
      talentNotice
    }, { e, scale: 1.4 })
  }
}
export default ProfileStat
