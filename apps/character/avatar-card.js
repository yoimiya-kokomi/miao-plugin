import { Artifact, Character, AvatarList, Avatar } from '../../models/index.js'
import { Cfg, Data, Common, Profile } from '../../components/index.js'
import lodash from 'lodash'
import { segment } from 'oicq'

// 角色昵称

let abbr = Character.getAbbr()

export async function renderAvatar (e, avatar, renderType = 'card') {
  // 如果传递的是名字，则获取
  if (typeof (avatar) === 'string') {
    let char = Character.get(avatar)
    if (!char) {
      return false
    }

    let MysApi = await e.getMysApi({
      auth: 'all',
      targetType: Cfg.get('char.queryOther', true) ? 'all' : 'self',
      cookieType: 'all',
      actionName: '查询信息'
    })

    if (!MysApi) return true

    let uid = MysApi.targetUser.uid

    if (char.isCustom) {
      avatar = { id: char.id, name: char.name, detail: false }
    } else {
      let profile = Profile.get(uid, char.id, true)
      if (profile) {
        // 优先使用Profile数据
        avatar = profile
      } else {
        // 使用Mys数据兜底
        let charData = await MysApi.getCharacter()
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
    let avatar = new Avatar(ds)
    let MysApi = await e.getMysApi({
      auth: 'all',
      targetType: Cfg.get('char.queryOther', true) ? 'all' : 'self',
      cookieType: 'all',
      actionName: '查询信息'
    })
    data = avatar.getData('id,name,sName,level,fetter,cons,weapon,elem,artis,imgs,dataSourceName,updateTime')
    if (MysApi && MysApi.isSelfCookie) {
      data.talent = await avatar.getTalent(MysApi)
      data.talentMap = ['a', 'e', 'q']
      // 计算皇冠个数
      data.crownNum = lodash.filter(lodash.map(data.talent, (d) => d.original), (d) => d >= 10).length
    }
  }
  let width = 600
  if (bg.mode === 'left') {
    width = 500 * bg.width / bg.height
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

/*
* 获取角色数据
* */
function getCharacterData (data, char) {
  let list = []
  let set = {}
  let artiEffect = []

  let avatar = new Avatar(data)
  if (!avatar) {
    return {}
  }
  let ret = avatar.getData('dataType,dataSourceName,name,abbr,level,weapon')
  console.log(ret)
  let w = data.weapon || {}
  let weapon = {
    type: 'weapon',
    name: w.name || '',
    abbr: abbr[w.name] || w.name || '',
    level: w.level || 1,
    affix: w.affix || w.affix_level || 0
  }

  let artis = data?.artis?.artis || data.reliquaries

  if (artis) {
    lodash.forEach(artis, (val) => {
      let setCfg = Artifact.getSetByArti(val.name)
      if (!setCfg) {
        return
      }
      let setName = setCfg.name
      if (set[setName]) {
        set[setName]++
        if (set[setName] === 2) {
          artiEffect.push('2件套：' + setCfg.effect['2'])
        }
        if (set[setName] === 4) {
          artiEffect.push('4件套：' + setCfg.name)
        }
      } else {
        set[setName] = 1
      }
    })

    if (artiEffect.length === 0) {
      artiEffect = ['无套装效果']
    }
  }

  let reliquaries = list[0]
  return {
    name: char.name,
    abbr: char.abbr,
    level: Data.def(data.lv, data.level),
    fetter: data.fetter,
    cons: Data.def(data.cons, data.actived_constellation_num),
    weapon,
    artiEffect,
    reliquaries
  }
}

export async function getAvatarList (e, type, MysApi) {
  let data = await MysApi.getCharacter()
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
