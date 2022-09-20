import { Character, Avatar, MysApi } from '../../models/index.js'
import { Cfg, Common, Profile } from '../../components/index.js'
import lodash from 'lodash'
import { segment } from 'oicq'

export async function renderAvatar (e, avatar, renderType = 'card') {
  // 如果传递的是名字，则获取
  let uid = e.uid
  if (typeof (avatar) === 'string') {
    let char = Character.get(avatar)
    if (!char) {
      return false
    }
    let mys = await MysApi.init(e)
    if (!mys) return true
    uid = mys.uid
    if (char.isCustom) {
      avatar = { id: char.id, name: char.name, detail: false }
    } else {
      let profile = Profile.get(uid, char.id, true)
      if (profile && profile.hasData) {
        // 优先使用Profile数据
        avatar = profile
      } else {
        // 使用Mys数据兜底
        let charData = await mys.getCharacter()
        if (!charData) return true

        let avatars = charData.avatars
        if (char.isTraveler) {
          char = await char.checkAvatars(avatars, uid)
        }
        avatars = lodash.keyBy(avatars, 'id')
        avatar = avatars[char.id] || { id: char.id, name: char.name, detail: false }
      }
    }
  }
  return await renderCard(e, avatar, renderType)
}

// 渲染角色卡片
async function renderCard (e, ds, renderType = 'card') {
  let char = Character.get(ds)
  if (!char) {
    return false
  }
  let bg = char.getCardImg(Cfg.get('char.se', false))
  if (renderType === 'photo') {
    e.reply(segment.image(process.cwd() + '/plugins/miao-plugin/resources/' + bg.img))
    return true
  }
  let uid = e.uid || (e.targetUser && e.targetUser.uid)
  let data = {}
  let custom = char.isCustom
  if (!custom) {
    let mys = await MysApi.init(e)
    let avatar = new Avatar(ds, uid, mys.isSelfCookie)
    data = avatar.getData('id,name,sName,level,fetter,cons,weapon,elem,artis,artisSet,imgs,dataSourceName,updateTime')
    data.talent = await avatar.getTalent(mys)
    if (data.talent) {
      data.talentMap = ['a', 'e', 'q']
      // 计算皇冠个数
      data.crownNum = lodash.filter(lodash.map(data.talent, (d) => d.original), (d) => d >= 10).length
    }
  }
  let width = 600
  if (bg.mode === 'left') {
    width = 600 * bg.width / bg.height
  }
  // 渲染图像
  let msgRes = await Common.render('character/character-card', {
    saveId: uid,
    uid,
    bg,
    widthStyle: `<style>html,body,#container{width:${width}px}</style>`,
    mode: bg.mode,
    custom,
    data
  }, { e, scale: 1.1, retMsgId: true })
  if (msgRes && msgRes.message_id) {
    // 如果消息发送成功，就将message_id和图片路径存起来，1小时过期
    await redis.set(`miao:original-picture:${msgRes.message_id}`, bg.img, { EX: 3600 })
  }
  return true
}

export async function getAvatarList (e, type, mys) {
  let data = await mys.getCharacter()
  if (!data) return false

  let avatars = data.avatars

  if (avatars.length <= 0) {
    return false
  }
  let list = []
  for (let val of avatars) {
    if (type !== false) {
      if (!Character.checkWifeType(val.id, type)) {
        continue
      }
    }
    if (val.rarity > 5) {
      val.rarity = 5
    }
    list.push(val)
  }

  if (list.length <= 0) {
    return false
  }
  let sortKey = 'level,fetter,weapon_level,rarity,weapon_rarity,cons,weapon_affix_level'
  list = lodash.orderBy(list, sortKey, lodash.repeat('desc,', sortKey.length).split(','))
  return list
}
