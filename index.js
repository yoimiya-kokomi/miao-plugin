import { Data, Version } from '#miao'
import Index from './tools/index.js'

if (!global.segment) {
  global.segment = (await import('oicq')).segment
}

export * from './apps/index.js'

if (Bot?.logger?.info) {
  Bot.logger.info('---------^_^---------')
  Bot.logger.info(`喵喵插件${Version.version}初始化~`)
} else {
  console.log(`喵喵插件${Version.version}初始化~`)
}

setTimeout(Index.init, 1000)
