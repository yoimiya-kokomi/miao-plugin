import { Data, Version } from './components/index.js'
import fs from 'fs'

export * from './apps/index.js'

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
  let common = await Data.importModule(Version.isV3 ? 'lib/common/common.js' : 'lib/common.js', 'root')
  if (common && common.default && common.default.relpyPrivate) {
    relpyPrivate = common.default.relpyPrivate
  }
  if (msgStr) {
    let msg = JSON.parse(msgStr)
    await relpyPrivate(msg.qq, msg.msg)
    await redis.del('miao:restart-msg')
    let msgs = [`当前喵喵版本: ${Version.version}`, '您可使用 #喵喵版本 命令查看更新信息']
    await relpyPrivate(msg.qq, msgs.join('\n'))
  }
  if (!fs.existsSync(process.cwd() + (Version.isV3 ? '/lib/plugins/runtime.js' : '/lib/adapter/runtime.js'))) {
    let msg = '警告：未检测到runtime，miao-plugin可能无法正常工作。请升级至最新版Yunzai以使用miao-plugin'
    if (!await redis.get('miao:runtime-warning')) {
      await relpyPrivate(msg.qq, msg)
      await redis.set('miao:runtime-warning', 'true', { EX: 3600 * 24 })
    } else {
      console.log(msg)
    }
  }
}, 1000)
