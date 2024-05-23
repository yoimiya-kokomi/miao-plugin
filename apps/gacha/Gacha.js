import { Common } from '#miao'
import { getTargetUid } from '../profile/ProfileCommon.js'
import GachaData from './GachaData.js'
import { Button, Character, Player } from '#miao.models'

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
    let qq = e.user_id
    if (!uid || !qq) {
      return false
    }

    let gacha = GachaData.analyse(e.user_id, uid, type, game)
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
    let qq = e.user_id
    if (!uid || !qq) {
      return false
    }
    let gacha = GachaData.stat(e.user_id, uid, type, game)
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

  getFace (uid, game) {
    let player = Player.create(uid, game)
    let defaultFaceChar = game === 'gs' ? 10000014 : 1005
    let faceChar = Character.get(player.face || defaultFaceChar, game)
    let imgs = faceChar?.imgs
    if (!imgs?.face) {
      imgs = Character.get(10000079).imgs
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
