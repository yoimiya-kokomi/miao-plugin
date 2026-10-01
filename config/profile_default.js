/**
 * 如需配置【复制】此文件，改名为profile.js
 * 暂未做热更新，修改完毕请重启yunzai
 * */

/**
 * Enka面板服务API配置
 *
 * 【Enka官网】：https://enka.network/
 * 感谢Enka提供的面板查询服务，如果可以的话，也可考虑在Patreon上支持Enka
 * 【Patreon】：https://www.patreon.com/algoinde
 *
 * 目前使用Miao-Plugin的默认UA请求国服UID时
 * 会默认重定向 https://enka.network/ 到 https://profile.microgg.cn/
 * 感谢@MiniGrayGay 大佬提供的服务(Github: https://github.com/MiniGrayGay)
 *
 * 使用代理(科学上网)可以配置proxyAgent
 * 例如: http://127.0.0.1:1080
 *
 * */
export const enkaApi = {
  url: 'https://enka.network/', // 请求API地址，可从上方提供的API地址中进行选择
  proxyAgent: '' // 请求的proxy配置，如无需proxy则留空
}

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

/**
 * 单个用户请求面板的间隔时间，单位分钟
 * 不同用户的计时独立
 *
 * 部分服务会同时返回服务侧更新冷却时间，若服务侧查询冷却大于更新间隔
 * 会以服务侧查询冷却为准（在服务侧冷却时间内，即使请求也不会返回更新数据）
 * */
export const requestInterval = 5

/**
 * 自定义面板图（立绘）的图库源列表
 *
 * 可配置多个源；同一层级（normal-character / super-character）的源会合并后随机使用，配置顺序不影响结果
 * 支持绝对路径，或相对resources目录的相对路径（使用..可读取插件目录外的图库）
 * 默认使用resources/profile/目录（定义于config/system/profile_system.js）
 *
 * 支持的图库结构（角色名后的图片可为目录，也可为{角色名}.webp|png|jpg|jpeg单文件）：
 *   {源}/normal-character/{角色名}  普通立绘
 *   {源}/super-character/{角色名}   彩蛋立绘（满命/ACE/三皇冠），无平铺形式
 *   {源}/{角色名}                   平铺形式，等同于普通立绘（部分第三方图库没有normal-character层）
 * 跨盘（如插件在C盘、图库在E盘）请直接填写绝对路径
 *
 * 注意：#上传面板图、#删除面板图 仍只作用于resources/profile/normal-character/，
 *      建议保留'profile'，否则上传的图片不会被读取；
 *      #面板图列表 会一并展示自定义图库（含平铺层）的图片，但仅默认图库的图片可删除
 * */
export const profileImgSrc = [
  'profile'
]
