// #老婆
import lodash from 'lodash'
import { Cfg } from '../../components/index.js'
import { Character } from '../../models/index.js'
import { getAvatarList, renderAvatar } from './avatar-card.js'

const relationMap = {
  wife: {
    keyword: '老婆,媳妇,妻子,娘子'.split(','),
    type: 0
  },
  husband: {
    keyword: '老公,丈夫,夫君,郎君'.split(','),
    type: 1
  },
  gf: {
    keyword: '女朋友,女友,女神'.split(','),
    type: 0
  },
  bf: {
    keyword: '男朋友,男友,男神'.split(','),
    type: 1
  },
  daughter: {
    keyword: '女儿'.split(','),
    type: 2
  },
  son: {
    keyword: '儿子'.split(','),
    type: 3
  }
}

const relation = lodash.flatMap(relationMap, (d) => d.keyword)
export const wifeReg = `^#?\\s*(${relation.join('|')})\\s*(设置|选择|指定|列表|查询|列表|是|是谁|照片|相片|图片|写真|图像)?\\s*([^\\d]*)\\s*(\\d*)$`

export async function wife (e, { User }) {
  let msg = e.msg || ''
  if (!msg && !e.isPoke) return false

  if (e.isPoke) {
    if (Cfg.isDisable(e, 'char.poke')) {
      return false
    }
  } else if (Cfg.isDisable(e, 'char.wife')) {
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

  let MysApi = await e.getMysApi({
    auth: 'all',
    targetType: Cfg.get('char.queryOther', true) ? 'all' : 'self',
    cookieType: 'all',
    actionName: '查询信息'
  })
  if (!MysApi || !MysApi.selfUser) {
    return true
  }
  let selfUser = MysApi.selfUser
  let selfMysUser = await selfUser.getMysUser()
  let isSelf = true
  if (!selfMysUser || selfMysUser.uid !== MysApi.targetUser.uid) {
    isSelf = false
  }

  switch (action) {
    case '卡片':
    case '照片':
    case '相片':
    case '图片':
    case '写真':
      // 展示老婆卡片

      // 如果选择过，则进行展示
      let renderType = action === '卡片' ? 'card' : 'photo'
      if (!e.isPoke) {
        wifeList = await selfUser.getCfg(`wife.${targetCfg.key}`, [])
        // 存在设置
        if (wifeList && wifeList.length > 0 && isSelf && !e.isPoke) {
          if (wifeList[0] === '随机') {
            // 如果选择为全部，则从列表中随机选择一个
            avatarList = await getAvatarList(e, targetCfg.type, MysApi)
            let avatar = lodash.sample(avatarList)
            return renderAvatar(e, avatar, renderType)
          } else {
            // 如果指定过，则展示指定角色
            return renderAvatar(e, lodash.sample(wifeList), renderType)
          }
        }
      }
      // 如果未指定过，则从列表中排序并随机选择前5个
      if (e.isPoke) {
        avatarList = await getAvatarList(e, false, MysApi)
        if (avatarList && avatarList.length > 0) {
          avatar = lodash.sample(avatarList)
          return await renderAvatar(e, avatar, renderType)
        }
      } else {
        avatarList = await getAvatarList(e, targetCfg.type, MysApi)
        if (avatarList && avatarList.length > 0) {
          avatar = lodash.sample(avatarList.slice(0, 5))
          return await renderAvatar(e, avatar, renderType)
        }
      }
      e.reply('在当前米游社公开展示的角色中未能找到适合展示的角色..')
      return true
      break
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
      let addRet = []
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
        /*
        avatarList = await getAvatarList(e, targetCfg.type, MysApi);
        avatarList = lodash.map(avatarList, (avatar) => avatar.name);
        avatarList = lodash.filter(avatarList, (d) => !!d);
        addRet = lodash.intersection(avatarList, wifeList);
        */
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
}

export async function pokeWife (e, components) {
  return await wife(e, components)
}
