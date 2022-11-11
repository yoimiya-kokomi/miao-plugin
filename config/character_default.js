/**
* 如需新增自定义角色可【复制】此文件，改名为character.js
* 复制的character.js中可按格式及自己需求进行配置
*
* 暂未做热更新，修改完毕请重启yunzai
* */

/**
* 角色列表，别名的第一个是标准名字，后面的为别名
* 实装的角色需要以数字roleid为key，自定义的角色及非实装角色请以英文为key
* */
export const customCharacters = {

  // 已有角色添加别名示例：为魈增加新的别名
  // roleid请参见Yunzai config/genshin/roleId.js
  10000026: ['魈', '风夜叉'],

  // 自定义角色，角色id请以小写英文定义
  paimon: ['派蒙', '应急食物']
}

/**
* 追加设置每个关系的可选角色，会与原有设置同时起作用
* 一个角色可以在多个关系中
* */
export const wifeData = {
  // 老婆&女朋友：成女、少女
  girlfriend: '雷神',

  // 老公&男朋友：成男、少男
  boyfriend: '散兵, 魈',

  // 女儿：萝莉
  daughter: '派蒙, 瑶瑶',

  // 儿子：正太
  son: ''
}