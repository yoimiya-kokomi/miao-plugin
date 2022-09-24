/*
* 如需配置【复制】此文件，改名为profile.js
* 暂未做热更新，修改完毕请重启yunzai
* */

/*
* Enka面板服务API配置
*
* 【Enka官网】：https://enka.network/
*
* 感谢Enka提供的面板查询服务
* https://github.com/yoimiya-kokomi/miao-plugin/issues/63#issuecomment-1199348789
* 如果可以的话，也可考虑在Patreon上支持Enka，或提供闲置的原神账户，具体可在Discord联系
*
* 如Enka服务访问不稳定，可尝试更换MiniGrayGay大佬提供的中转服务
* 【广州节点】：https://enka.microgg.cn/
* 【上海节点】：https://enka.minigg.cn/
* 推荐使用【广州】或【上海】节点，如访问enka官网相对稳定的话推荐优先使用官方地址
* 感谢@MiniGrayGay 大佬提供的服务(Github: https://github.com/MiniGrayGay)
*
* 使用代理(科学上网)可以配置proxyAgent
* 例如: http://127.0.0.1:1080
* */

export const enkaApi = {
  url: 'https://enka.network/', // 请求API地址，可从上方提供的API地址中进行选择
  proxyAgent: '' // 请求的proxy配置，如无需proxy则留空
}

/*
* 单个用户请求面板的间隔时间，单位秒
* 不同用户的计时独立
*
* empty: 获取结果为空，默认5分钟
* success: 获取成功，默认3分钟
* fail: 获取失败，默认1分钟
*
* 部分请求会同时返回服务侧缓存时间，若间隔小于缓存时间，则会以缓存时间为准
* */
export const reqInterval = {
  empty: 60 * 5,
  success: 60 * 3,
  fail: 60
}

/*
* MiaoApi内部私用的面板更新服务
* 面向Yunzai开发者及有投喂的老板们的小范围服务
* 需要具备Token才会启用-
* */
export const miaoApi = {
  url: 'http://miaoapi.cn/profile',
  token: '请求Token'
}
