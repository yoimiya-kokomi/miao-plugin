// #老婆
import lodash from 'lodash'
import { Common } from '#miao'
import { Character, MysApi, Player } from '#miao.models'
import Avatar from './AvatarCard.js'

const relationMap = {
  wife: {
    keyword: '老婆,媳妇,妻子,娘子,宝贝'.split(','),
    type: 0
  },
  husband: {
    keyword: '老公,丈夫,夫君,郎君,死鬼'.split(','),
    type: 1
  },
  gf: {
    keyword: '女朋友,女友,女神,女王,女票'.split(','),
    type: 0
  },
  bf: {
    keyword: '男朋友,男友,男神,男票'.split(','),
    type: 1
  },
  daughter: {
    keyword: '女儿,闺女,小宝贝'.split(','),
    type: 2
  },
  son: {
    keyword: '儿子,犬子'.split(','),
    type: 3
  }
}

const relation = lodash.flatMap(relationMap, (d) => d.keyword)
const wifeReg = `^#?\\s*(${relation.join('|')})\\s*(设置|选择|指定|列表|查询|列表|是|是谁|照片|相片|图片|写真|图像)?\\s*([^\\d]*)\\s*(\\d*)$`

async function getAvatarList (player, type) {
  await player.refreshMysDetail()
  let list = []
  player.forEachAvatar((avatar) => {
    if (type !== false) {
      if (!avatar.char.checkWifeType(type)) {
        return true
      }
    }
    list.push(avatar)
  })

  if (list.length <= 0) {
    return false
  }
  let sortKey = 'level,fetter,weapon_level,rarity,weapon_rarity,cons,weapon_affix_level'
  list = lodash.orderBy(list, sortKey, lodash.repeat('desc,', sortKey.length).split(','))
  return list
}

const Wife = {
  reg: wifeReg,
  async render (e) {
    let msg = e.msg || ''
    if (!msg && !e.isPoke) return false

    if (e.isPoke) {
      if (!Common.cfg('avatarPoke')) {
        return false
      }
    } else if (!Common.cfg('avatarCard')) {
      return false
    }

    let msgRet = (new RegExp(wifeReg)).exec(msg)
    if (e.isPoke) {
      msgRet = []
    } else if (!msgRet) {
      return false
    }
    let target = msgRet[1]
    let action = msgRet[2] || '卡片'
    let actionParam = msgRet[3] || ''

    if (!'设置,选择,挑选,指定'.split(',').includes(action) && actionParam) {
      return false
    }

    let targetCfg = lodash.find(relationMap, (cfg, key) => {
      cfg.key = key
      return cfg.keyword.includes(target)
    })
    if (!targetCfg && !e.isPoke) return true

    let avatarList = []
    let avatar = {}
    let wifeList = []

    let mys = await MysApi.init(e)
    if (!mys || !mys.uid) {
      return true
    }
    let player = Player.create(e)
    let selfUser = mys.selfUser
    let isSelf = true
    let renderType = (action === '卡片' ? 'card' : 'photo')
    let addRet = []
    switch (action) {
      case '卡片':
      case '照片':
      case '相片':
      case '图片':
      case '写真':
        // 展示老婆卡片
        // 如果选择过，则进行展示
        if (!e.isPoke) {
          wifeList = await selfUser.getCfg(`wife.${targetCfg.key}`, [])
          // 存在设置
          if (wifeList && wifeList.length > 0 && isSelf && !e.isPoke) {
            if (wifeList[0] === '随机') {
              // 如果选择为全部，则从列表中随机选择一个
              avatarList = await getAvatarList(player, targetCfg.type, mys)
              let avatar = lodash.sample(avatarList)
              return Avatar.renderAvatar(e, avatar, renderType)
            } else {
              // 如果指定过，则展示指定角色
              return Avatar.renderAvatar(e, lodash.sample(wifeList), renderType)
            }
          }
        }
        // 如果未指定过，则从列表中排序并随机选择
        avatarList = await getAvatarList(player, e.isPoke ? false : targetCfg.type, mys)
        if (avatarList && avatarList.length > 0) {
          avatar = lodash.sample(avatarList)
          return await Avatar.renderAvatar(e, avatar, renderType)
        }
        e.reply('在当前米游社公开展示的角色中未能找到适合展示的角色..')
        return true
      case '设置':
      case '选择':
      case '挑选':
      case '指定':
        if (!isSelf) {
          e.reply('只能指定自己的哦~')
          return true
        }
        // 选择老婆
        actionParam = actionParam.replace(/(，|、|;|；)/g, ',')
        wifeList = actionParam.split(',')
        if (lodash.intersection(['全部', '任意', '随机', '全都要'], wifeList).length > 0) {
          addRet = ['随机']
        } else {
          wifeList = lodash.map(wifeList, (name) => {
            let char = Character.get(name)
            if (char && char.checkWifeType(targetCfg.type)) {
              return char.name
            }
          })
          wifeList = lodash.filter(lodash.uniq(wifeList), (d) => !!d)
          addRet = wifeList
          if (addRet.length === 0) {
            e.reply(`在可选的${targetCfg.keyword[0]}列表中未能找到 ${actionParam} ~`)
            return true
          }
        }
        await selfUser.setCfg(`wife.${targetCfg.key}`, addRet)
        e.reply(`${targetCfg.keyword[0]}已经设置：${addRet.join('，')}`)
        return true
      case '列表':
      case '是':
      case '是谁':
        // 查看当前选择老婆
        if (!isSelf) {
          e.reply('只能查看自己的哦~')
          return true
        }
        wifeList = await selfUser.getCfg(`wife.${targetCfg.key}`, [])
        if (wifeList && wifeList.length > 0) {
          e.reply(`你的${targetCfg.keyword[0]}是：${wifeList.join('，')}`)
        } else {
          e.reply(`尚未设置，回复#${targetCfg.keyword[0]}设置+角色名 来设置，如果设置多位请用逗号间隔`)
        }
        break
    }
    return true
  },
  async poke (e) {
    return await Wife.render(e)
  }
}

export default Wife
