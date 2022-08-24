import { Artifact, Character } from '../../models/index.js'
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
        char.checkAvatars(avatars)
        avatars = lodash.keyBy(avatars, 'id')
        avatar = avatars[char.id] || { id: char.id, name: char.name, detail: false }
      }
    }
  }
  return await renderCard(e, avatar, renderType)
}

// 渲染角色卡片
async function renderCard (e, avatar, renderType = 'card') {
  let char = Character.get(avatar)

  if (!char) {
    return false
  }
  let uid = e.uid || (e.targetUser && e.targetUser.uid)

  let crownNum = 0;
  let talent = {}
  if (!char.isCustom) {
    talent = await getTalent(e, avatar)
    // 计算皇冠个数
    crownNum = lodash.filter(lodash.map(talent, (d) => d.original), (d) => d >= 10).length
  }
  let bg = char.getCardImg(Cfg.get('char.se', false))
  if (renderType === 'photo') {
    e.reply(segment.image(process.cwd() + '/plugins/miao-plugin/resources/' + bg.img))
  } else {
    // 渲染图像
    let msgRes = await Common.render('character/character-card', {
      save_id: uid,
      uid,
      talent,
      crownNum,
      talentMap: { a: '普攻', e: '战技', q: '爆发' },
      bg,
      custom: char.isCustom,
      ...getCharacterData(avatar),
      ds: char.getData('name,id,title,desc')
    }, { e, scale: 1.6, retMsgId: true })
    if (msgRes && msgRes.message_id) {
      // 如果消息发送成功，就将message_id和图片路径存起来，1小时过期
      await redis.set(`miao:original-picture:${msgRes.message_id}`, bg.img, { EX: 3600 })
    }
    return true
  }
  return true
}

// 获取角色技能数据
async function getTalent (e, avatars) {
  let talent = {};
  let cons = 0;
  let char = Character.get(avatars.id);
  let mode = 'level'
  if (char.isCustom) {
    return {}
  }
  if (avatars.dataSource && avatars.talent) {
    // profile模式
    talent = avatars.talent || {}
    cons = avatars.cons || 0
  } else {
    let MysApi = await e.getMysApi({
      auth: 'all',
      targetType: Cfg.get('char.queryOther', true) ? 'all' : 'self',
      cookieType: 'all',
      actionName: '查询信息'
    })
    if (!MysApi && !MysApi.isSelfCookie) return {}
    let skillRes = await MysApi.getAvatar(avatars.id)
    cons = avatars.actived_constellation_num
    mode = 'original'
    if (skillRes && skillRes.skill_list) {
      let skillList = lodash.orderBy(skillRes.skill_list, ['id'], ['asc'])
      for (let val of skillList) {
        if (val.name.includes('普通攻击')) {
          talent.a = val
          continue
        }
        if (val.max_level >= 10 && !talent.e) {
          talent.e = val
          continue
        }
        if (val.max_level >= 10 && !talent.q) {
          talent.q = val
        }
      }
    }
  }

  return char.getAvatarTalent(talent, cons, mode)
}

/*
* 获取角色数据
* */
function getCharacterData (avatars) {
  let list = []
  let set = {}
  let artiEffect = []
  let w = avatars.weapon || {}
  let weapon = {
    type: 'weapon',
    name: w.name || '',
    showName: abbr[w.name] || w.name || '',
    level: w.level || 1,
    affix: w.affix || w.affix_level || 0
  }

  let artis = avatars?.artis?.artis || avatars.reliquaries

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

  if (avatars.id == '10000005') {
    avatars.name = '空'
  } else if (avatars.id == '10000007') {
    avatars.name = '荧'
  }

  let reliquaries = list[0]
  return {
    name: avatars.name,
    showName: abbr[avatars.name] ? abbr[avatars.name] : avatars.name,
    level: Data.def(avatars.lv, avatars.level),
    fetter: avatars.fetter,
    cons: Data.def(avatars.cons, avatars.actived_constellation_num),
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