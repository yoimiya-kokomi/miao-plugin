/**
* 如需配置【复制】此文件，改名为profile.js
* 暂未做热更新，修改完毕请重启yunzai
* */

/**
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

/**
* 单个用户请求面板的间隔时间，单位分钟
* 不同用户的计时独立
*
* 部分服务会同时返回服务侧更新冷却时间，若服务侧查询冷却大于更新间隔
* 会以服务侧查询冷却为准（在服务侧冷却时间内，即使请求也不会返回更新数据）
* */
export const requestInterval = 5

/**
* 喵喵Api 私有的面板更新服务
* 供Yunzai开发者及有投喂的老板们小范围使用
*
* 喵喵API承载能力有限，Enka可用的情况下建议使用Enka，token有有效期限制，请勿强行投喂
* token请勿外传，一个token仅供一个bot使用，多bot复用的话可能导致token失效
* */
export const miaoApi = {
  qq: '在此处填写主人QQ',
  token: '在此处填写QQ对应Token'
}
