import lodash from 'lodash'
import Base from './Base.js'
import ProfileServ from './ProfileServ.js'
import fetch from 'node-fetch'

function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default class ProfileReq extends Base {
  constructor ({ e, uid }) {
    super()
    this.e = e
    this.uid = uid
  }

  async setCd (seconds = 60) {
    let ext = new Date() * 1 + seconds * 1000
    await redis.set(`miao:profile-cd:${this.uid}`, ext + '', { EX: seconds })
  }

  async inCd () {
    let ext = await redis.get(`miao:profile-cd:${this.uid}`)
    if (!ext || isNaN(ext)) {
      return false
    }
    let cd = new Date() * 1 - ext
    if (cd < 0) {
      return Math.ceil(0 - cd / 1000)
    }
    return false
  }

  err (msg = '', cd = 0) {
    const msgs = {
      error: '请求失败，可能是服务负载较高，请稍后重试...',
      empty: '请将角色放置在【游戏内】角色展柜，并打开【显示详情】，等待5分钟重新获取面板'
    }
    msg = msgs[msg] || msg
    if (msg) {
      this.e.reply(msg)
    }
    // 设置CD
    if (cd) {
      this.setCd(cd)
    }
    return false
  }

  msg (msg) {
    this.e.reply(msg)
  }

  async request () {
    let Serv = ProfileReq.getServ(this.uid)
    let reqParam = await Serv.getReqParam(this.uid)

    let cdTime = await this.inCd()
    if (cdTime) {
      return this.err(`请求过快，请${cdTime}秒后重试..`)
    }
    await this.setCd(20)
    this.msg('开始获取数据，可能会需要一定时间~')
    await sleep(100)
    // 发起请求
    let data = {}
    try {
      let req = await fetch(reqParam.url, reqParam.params || {})
      data = await req.json()
    } catch (e) {
      console.log('面板请求错误', e)
      data = {}
    }
    data = await Serv.response(data, this)
    // 设置CD
    cdTime = Serv.getCdTime(data)
    if (cdTime) {
      await this.setCd(cdTime)
    }
    if (data === false) {
      return false
    }
    let userData = Serv.getUserData(data)
    let profiles = Serv.getProfileData(data)
    cdTime = Serv.getCdTime(data)
    if (cdTime) {
      await this.setCd(cdTime)
    }
    return lodash.extend({
      uid: this.uid,
      chars: profiles
    }, userData)
  }
}

ProfileReq.serv = {}
ProfileReq.regServ = function (serv) {
  for (let key in serv) {
    ProfileReq.serv[key] = serv[key]
  }
}
ProfileReq.getServ = function (uid) {
  return ProfileServ.getServ({ uid, serv: ProfileReq.serv })
}
