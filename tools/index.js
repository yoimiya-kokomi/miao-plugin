import { Data, Version } from '#miao'
import fs from 'node:fs'
import Trans from './trans.js'

let relpyPrivate = async function () {
}
let common = await Data.importModule('lib/common/common.js', 'root')
if (common && common.default && common.default.relpyPrivate) {
  relpyPrivate = common.default.relpyPrivate
}

const Index = {
  async init () {
    await Index.checkVersion()
    await Index.startMsg()
    Index.transUserData()
  },

  // 发启动消息
  async startMsg () {
    let msgStr = await redis.get('miao:restart-msg')
    if (msgStr) {
      let msg = JSON.parse(msgStr)
      await relpyPrivate(msg.qq, msg.msg)
      await redis.del('miao:restart-msg')
      let msgs = [`当前喵喵版本: ${Version.version}`, '您可使用 #喵喵版本 命令查看更新信息']
      await relpyPrivate(msg.qq, msgs.join('\n'))
    }
  },

  // 检查版本
  async checkVersion () {
    if (!Version.isV3 && !Version.isAlemonjs) {
      console.log('警告：miao-plugin需要V3 Yunzai，请升级至最新版Miao-Yunzai以使用miao-plugin')
    }
    if (!fs.existsSync(process.cwd() + '/lib/plugins/runtime.js')) {
      let msg = '警告：未检测到runtime，miao-plugin可能无法正常工作。请升级至最新版Miao-Yunzai以使用miao-plugin'
      if (!await redis.get('miao:runtime-warning')) {
        await relpyPrivate(msg.qq, msg)
        await redis.set('miao:runtime-warning', 'true', { EX: 3600 * 24 })
      } else {
        console.log(msg)
      }
    }
  },

  // 迁移面板数据
  transUserData () {
    Trans.init()
  }
}
export default Index
