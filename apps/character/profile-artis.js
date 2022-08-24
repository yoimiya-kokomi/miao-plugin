/*
* 角色圣遗物评分详情
*
* */
import lodash from 'lodash'
import { Profile, Common } from '../../components/index.js'
import { getTargetUid, profileHelp, autoGetProfile } from './profile-common.js'
import { Artifact } from '../../models/index.js'

/*
* 角色圣遗物面板
* */
export async function profileArtis (e) {
  let { uid, avatar } = e

  let { profile, char, err } = await autoGetProfile(e, uid, avatar, async () => {
    await profileArtis(e)
  })

  if (err) {
    return
  }

  if (!profile.hasArtis()) {
    e.reply('未能获得圣遗物详情，请重新获取面板信息后查看')
    return true
  }

  let charCfg = profile.artis.getCharCfg()
  let { artis, mark: totalMark, markClass: totalMarkClass, usefulMark } = profile.getArtisMark()

  let { attrMap } = Artifact.getMeta()

  // 渲染图像
  return await Common.render('character/artis-mark', {
    uid,
    elem: char.elem,
    data: profile,
    artis,
    totalMark,
    totalMarkClass,
    usefulMark,
    attrMap,
    charCfg
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
    if (!profile.hasData || !profile.hasArtis()) {
      return
    }
    let profileArtis = profile.getArtisMark()
    lodash.forEach(profileArtis.artis, (arti, idx) => {
      arti.usefulMark = profileArtis.usefulMark
      arti.avatar = name
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

  // 渲染图像
  return await Common.render('character/artis-list', {
    save_id: uid,
    uid,
    artis
  }, { e, scale: 1.4 })
}
