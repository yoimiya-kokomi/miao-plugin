/*
* 角色圣遗物评分详情
*
* */
import lodash from 'lodash'
import { Cfg, Common, Meta } from '#miao'
import { getTargetUid, profileHelp, getProfileRefresh } from './ProfileCommon.js'
import { Artifact, Character, Player } from '#miao.models'
import ArtisMarkCfg from '../../models/artis/ArtisMarkCfg.js'

/*
* 角色圣遗物面板
* */
export async function profileArtis (e) {
  let { uid, avatar } = e
  let profile = e._profile || await getProfileRefresh(e, avatar)
  if (!profile) {
    return true
  }
  if (!profile.hasArtis()) {
    e.reply('未能获得圣遗物详情，请重新获取面板信息后查看')
    return true
  }
  let char = profile.char
  let { game } = char
  let charCfg = ArtisMarkCfg.getCfg(profile)

  let { attrMap } = Meta.getMeta('gs', 'arti')

  let artisDetail = profile.getArtisMark()
  let artisKeyTitle = Artifact.getArtisKeyTitle()

  // 渲染图像
  return await Common.render('character/artis-mark', {
    uid,
    elem: char.elem,
    splash: profile.costumeSplash,
    data: profile,
    costume: profile.costume ? '2' : '',
    artisDetail,
    artisKeyTitle,
    attrMap,
    charCfg,
    game,
    changeProfile: e._profileMsg
  }, { e, scale: 1.6 / 1.1 })
}

/*
* 圣遗物列表
* */
export async function profileArtisList (e) {
  let uid = await getTargetUid(e)
  if (!uid) {
    return true
  }

  let artis = []
  let player = Player.create(uid)
  player.forEachAvatar((avatar) => {
    let profile = avatar.getProfile()
    if (!profile) {
      return true
    }
    let name = profile.name
    let char = Character.get(name)
    if (!profile.hasData || !profile.hasArtis()) {
      return true
    }
    let profileArtis = profile.getArtisMark()
    lodash.forEach(profileArtis.artis, (arti, idx) => {
      arti.charWeight = profileArtis.charWeight
      arti.avatar = name
      arti.side = char.side
      artis.push(arti)
    })
  })

  if (artis.length === 0) {
    e.reply('请先获取角色面板数据后再查看圣遗物列表...')
    await profileHelp(e)
    return true
  }
  artis = lodash.sortBy(artis, '_mark')
  artis = artis.reverse()
  let number = Cfg.get('artisNumber', 28)
  artis = artis.slice(0, `${number}`)
  let artisKeyTitle = Artifact.getArtisKeyTitle()

  // 渲染图像
  return await Common.render('character/artis-list', {
    save_id: uid,
    uid,
    artis,
    artisKeyTitle
  }, { e, scale: 1.4 })
}
