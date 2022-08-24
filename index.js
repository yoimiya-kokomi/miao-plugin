import { Data, Version } from './components/index.js'

export * from './apps/index.js'
let index = { miao: {} }
if (Version.isV3) {
  index = await Data.importModule('/plugins/miao-plugin/adapter', 'v3-entrance.js')
}
export const miao = index.miao || {}
if (Bot?.logger?.info) {
  Bot.logger.info('---------^_^---------')
  Bot.logger.info(`喵喵插件${Version.version}初始化~`)
} else {
  console.log(`喵喵插件${Version.version}初始化~`)
}

setTimeout(async function () {
  let msgStr = await redis.get('miao:restart-msg')
  let relpyPrivate = async function () {
  }
  if (!Version.isV3) {
    let common = await Data.importModule('/lib', 'common.js')
    if (common && common.default && common.default.relpyPrivate) {
      relpyPrivate = common.default.relpyPrivate
    }
  }
  if (msgStr) {
    let msg = JSON.parse(msgStr)
    await relpyPrivate(msg.qq, msg.msg)
    await redis.del('miao:restart-msg')
    let msgs = [`当前喵喵版本: ${Version.version}`, '您可使用 #喵喵版本 命令查看更新信息']
    await relpyPrivate(msg.qq, msgs.join('\n'))
  }
}, 1000)
