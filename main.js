import { createApp } from 'alemonjs'
import { apps } from './index.js'
/**
 * *******
 * 创建应用 createApp
 * 重定义  reSetEvent
 * 切割消息 replace
 * 使用 use
 * 挂载 mount
 * *******
 * global.YUNZAI_GENSHIN 原神星铁重定义方法 | 方便A崽统一修改
 * global.YUNZAI_EVENT 非原神星铁相关的重定义方法 | 方便A崽统一修改
 * global.YUNZAI_REG 星铁消息的正则变量
 * *******
 */
createApp(import.meta.url)
.reSetEvent(global.YUNZAI_GENSHIN)
.replace(global.YUNZAI_REG,'#星铁')
.replace(/^(\/|#)/,'#')
.use(apps)
.mount()
