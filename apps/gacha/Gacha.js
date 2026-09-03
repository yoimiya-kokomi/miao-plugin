import { Common } from '#miao'
import { getTargetUid } from '../profile/ProfileCommon.js'
import GachaData from './GachaData.js'
import GachaPool from './GachaPool.js'
import { Button, Character, Player, Weapon } from '#miao.models'

let Gacha = {
  async detail (e) {
    let msg = e.msg.replace(/#|抽卡|记录|祈愿|分析|池/g, '')
    let game = /星铁/.test(msg) ? 'sr' : 'gs'
    msg = msg.replace(/星铁/, '')
    let type
    if (e.isSr) {
      type = 11
      switch (msg) {
        case 'up':
        case '抽卡':
        case '角色':
        case '抽奖':
          type = 11
          break
        case '常驻':
          type = 1
          break
        case '武器':
        case '光锥':
          type = 12
          break
      }
    } else {
      type = 301
      switch (msg) {
        case 'up':
        case '抽卡':
        case '角色':
        case '抽奖':
          type = 301
          break
        case '常驻':
          type = 200
          break
        case '武器':
          type = 302
          break
        case '集录':
          type = 500
          break
      }
    }
    let uid = e.uid || await getTargetUid(e)
    let qq = e.user.qq
    if (!uid || !qq) {
      return false
    }

    let gacha = GachaData.analyse(qq, uid, type, game)
    if (!gacha) {
      e.reply([`UID:${uid} 本地暂无抽卡信息，请通过【#抽卡帮助】获得绑定帮助...`, new Button(e).gacha()])
      return true
    }

    if (type === 302 || type === 12) type = 'weapon'
    this.reply([await Common.render('gacha/gacha-detail', {
      save_id: uid,
      uid,
      gacha,
      face: Gacha.getFace(uid, game),
      game,
      type,
      elem: e.isSr ? 'sr' : 'hydro'
    }, { e, scale: 1.4, retType: 'base64' }), new Button(e).gacha()])
  },
  async stat (e) {
    let msg = e.msg.replace(/#|统计|分析|池/g, '')
    let game = /星铁/.test(msg) ? 'sr' : 'gs'
    msg = msg.replace(/星铁/, '')
    let type = 'up'
    if (/武器|光锥/.test(msg)) {
      type = 'weapon'
    } else if (/角色/.test(msg)) {
      type = 'char'
    } else if (/常驻/.test(msg)) {
      type = 'normal'
    } else if (/集录/.test(msg)) {
      type = 'mix'
    } else if (/全部/.test(msg)) {
      type = 'all'
    }
    let uid = e.uid || await getTargetUid(e)
    let qq = e.user.qq
    if (!uid || !qq) {
      return false
    }
    let gacha = GachaData.stat(qq, uid, type, game)
    if (!gacha) {
      e.reply([`UID:${uid} 本地暂无抽卡信息，请通过【#抽卡帮助】获得绑定帮助...`, new Button(e).gacha()])
      return true
    }
    e.reply([await Common.render('gacha/gacha-stat', {
      save_id: uid,
      uid,
      gacha,
      face: Gacha.getFace(uid, game),
      game,
      elem: e.isSr ? 'sr' : 'hydro'
    }, { e, scale: 1.4, retType: 'base64' }), new Button(e).gacha()])
  },

  // 卡池信息查询：#6.7卡池 / #6.7上半卡池 / #星铁4.1下半卡池
  async info (e) {
    let param = GachaPool.parse(e.msg)
    if (!param) {
      return false
    }
    let { game, version, half } = param
    // 上下半英文标识：无/空 → all，上半 → up，下半 → down，其他值保留原值
    let half_key = !half ? 'all' : half === '上半' ? 'up' : half === '下半' ? 'down' : half
    let pools = GachaPool.getData(game, version, half)
    if (!pools.length) {
      e.reply(`未找到 ${game === 'sr' ? '星铁' : '原神'}${version}${half} 的卡池信息`)
      return true
    }
    e.reply(await Common.render('gacha/gacha-info', {
      save_id: `pool-${game}-${version}-${half_key}`,
      pools,
      game,
      elem: game === 'sr' ? 'sr' : 'hydro'
    }, { e, scale: 1.4, retType: 'base64' }))
    return true
  },

  // 卡池信息穿透查询：#${name}卡池(默认精简) / #星铁${name}卡池(默认精简) / #${name}卡池详情(详细，完整)
  async infoByItem (e) {
    let msg = e.msg || ''
    let ret = /^#(星铁)?(.+?)卡池(详情|详细)?$/.exec(msg)
    if (!ret) {
      return false
    }
    let isSrPrefix = !!ret[1]
    let item = (ret[2] || '').trim()
    // 正则回溯可能把「星铁」吞入 item，统一归一
    if (item.startsWith('星铁')) {
      isSrPrefix = true
      item = item.slice(2).trim()
    }
    if (!item) {
      return false
    }
    // 版本查询（如 #6.7卡池 / #星铁3.0卡池）交给 info 处理，避免误命中
    if (/^(?:\d+\.)+\d+(?:上半|下半)?$/.test(item)) {
      return false
    }
    // 默认精简（只显示包含查询项的那一行）；后缀「详情/详细」才显示完整卡池
    let isDetail = !!ret[3]
    let simple = !isDetail
    let result = GachaPool.searchByItem(item, simple, isSrPrefix)
    if (!result) {
      e.reply(`未找到 ${item} 的卡池信息`)
      return true
    }
    let { game, pools } = result
    // 解析标准名与类型，生成稳定的英文缓存 id
    let resolved = GachaPool.resolveItem(item, game)
    let item_type = 'unknown'
    let item_id = 'unknown'
    if (resolved) {
      let model = resolved.type === 'char'
        ? Character.get(resolved.name, resolved.game)
        : Weapon.get(resolved.name, resolved.game)
      if (model) {
        if (model.star) {
          item_type = `${resolved.type}${model.star}`
        }
        if (model.id !== undefined && model.id !== null && model.id !== '') {
          item_id = model.id
        }
      }
    }
    let simple_key = simple ? 'simple' : 'detail'
    e.reply(await Common.render('gacha/gacha-info', {
      save_id: `pool-${game}-${item_type}-${item_id}-${simple_key}`,
      pools,
      game,
      elem: game === 'sr' ? 'sr' : 'hydro'
    }, { e, scale: 1.4, retType: 'base64' }))
    return true
  },

  // 卡池历史查询命令帮助：#卡池帮助 / #星铁卡池帮助 / #卡池
  async help (e) {
    let helpMsg = [
      '【卡池查询命令帮助】',
      '',
      '📖 历史卡池查询',
      '✅ #x.x卡池  查原神历史卡池',
      '    #6.0卡池',
      '    #6.7上半卡池',
      '',
      '✅ *x.x卡池  查星铁历史卡池',
      '    *3.0卡池',
      '    *4.1下半卡池',
      '',
      '🔍 原神/星铁角色/武器穿透查询',
      'ℹ️ #角色/武器名卡池',
      '    #白厄卡池',
      '    #舞舞舞卡池',
      '',
      'ℹ️ #角色/武器名卡池详情|详细',
      '    #火神卡池详情'

    ]
    e.reply(helpMsg.join('\n'))
    return true
  },

  getFace (uid, game) {
    let player = Player.create(uid, game)
    let defaultFaceChar = game === 'gs' ? 10000014 : 1005
    let faceChar = Character.get(player.face || defaultFaceChar, game)
    let imgs = faceChar?.imgs
    if (!imgs?.face) {
      imgs = game === 'gs' ? Character.get(10000079, game).imgs : Character.get(1005, game).imgs
    }
    return {
      banner: imgs?.banner,
      face: imgs?.face,
      qFace: imgs?.qFace,
      name: player.name || '旅行者',
      sign: player.sign,
      level: player.level
    }
  }
}
export default Gacha
