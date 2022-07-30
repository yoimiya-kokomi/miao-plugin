/*
* 如需配置【复制】此文件，改名为profile.js
* 暂未做热更新，修改完毕请重启yunzai
* */

/*
* Enka面板服务API配置
*
* 【Enka官网】：https://enka.shinshin.moe/
* 感谢Enka提供的面板查询服务
* https://github.com/yoimiya-kokomi/miao-plugin/issues/63#issuecomment-1199348789
* 如果可以的话，也可考虑在Patreon上支持Enka，或提供闲置的原神账户，具体可在Discord联系
*
*
* 如Enka服务访问不稳定，可尝试更换MiniGrayGay大佬提供的中转服务
* 【链接1】：https://enka.microgg.cn/
* 【链接2】：https://enka.minigg.cn/
* 感谢@MiniGrayGay 大佬提供的服务(Github: https://github.com/MiniGrayGay)
*
* */

export const enkaApi = {
  url: 'https://enka.shinshin.moe/'
}

/*
* 单个用户请求面板的间隔时间，单位分钟
* 不同用户的计时独立
*
* 因为服务数据更新需要5分钟左右，建议设置为5分钟或5分钟以上
* 可降低对服务的压力，同时防止过度刷屏
* */
export const requestInterval = 5

/*
* MiaoApi面板更新地址，暂时支持B服角色
* */
export const miaoApi = {
  url: 'http://49.232.91.210/profile',
  token: '请求Token'
}
