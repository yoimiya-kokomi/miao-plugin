/*
* 角色圣遗物评分详情
*
* */
import lodash from 'lodash'
import { Profile, Common } from '../../components/index.js'
import { getTargetUid, profileHelp, autoGetProfile } from './ProfileCommon.js'
import { Artifact, Character, ProfileArtis } from '../../models/index.js'

/*
* 角色圣遗物面板
* */
export async function profileArtis (e) {
  let { uid, avatar } = e

  let profile
  if (e._profile) {
    profile = e._profile
  } else {
    let autoRet = await autoGetProfile(e, uid, avatar, async () => {
      await profileArtis(e)
    })
    if (autoRet.err) {
      return false
    }
    profile = autoRet.profile
  }
  let char = profile.char

  if (!profile.hasArtis()) {
    e.reply('未能获得圣遗物详情，请重新获取面板信息后查看')
    return true
  }

  let charCfg = profile.artis.getCharCfg()

  let { attrMap } = Artifact.getMeta()

  let artisDetail = profile.getArtisMark()
  let artisKeyTitle = ProfileArtis.getArtisKeyTitle()

  // 渲染图像
  return await Common.render('character/artis-mark', {
    uid,
    elem: char.elem,
    splash: char.getImgs(profile.costume).splash,
    data: profile,
    costume: profile.costume ? '2' : '',
    artisDetail,
    artisKeyTitle,
    attrMap,
    charCfg,
    changeProfile: e._profileMsg
  }, { e, scale: 1.3 })
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
  let profiles = Profile.getAll(uid) || {}

  if (!profiles || profiles.length === 0) {
    e.reply('暂无角色圣遗物详情')
    return true
  }

  lodash.forEach(profiles || [], (profile) => {
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
  artis = artis.slice(0, 28)
  let artisKeyTitle = ProfileArtis.getArtisKeyTitle()

  // 渲染图像
  return await Common.render('character/artis-list', {
    save_id: uid,
    uid,
    artis,
    artisKeyTitle
  }, { e, scale: 1.4 })
}
