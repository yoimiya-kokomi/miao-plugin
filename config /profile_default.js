/*
* 如需配置【复制】此文件，改名为profile.js
*
* 暂未做热更新，修改完毕请重启yunzai
* */

/*
* Enka面板服务API配置
* *
* 若enka服务无法正常访问，可尝试修改下配置文件中的地址
* 默认地址：https://enka.shinshin.moe/
* 国内服务：https://enka.microgg.cn/
* */

export const enkaApi = {
  url: 'https://enka.shinshin.moe/',
  userAgent: 'Miao-Plugin/3.0'
}

/*
* MiaoApi面板更新地址，暂时只支持B服角色
* */

export const miaoApi = {
  url: 'http://49.232.91.210/profile',
  token: 'miao-token'
}
