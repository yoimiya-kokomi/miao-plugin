/*
* 此配置文件为系统使用，请勿修改，否则可能无法正常使用
*
* 如需自定义配置请复制修改上一级help_default.js
*
* */

export const helpCfg = {
  title: '喵喵帮助',
  subTitle: 'Yunzai-Bot & Miao-Plugin',
  columnCount: 3,
  colWidth: 265,
  theme: 'all',
  themeExclude: ['default'],
  style: {
    fontColor: '#ceb78b',
    descColor: '#eee',
    contBgColor: 'rgba(6, 21, 31, .5)',
    contBgBlur: 3,
    headerBgColor: 'rgba(6, 21, 31, .4)',
    rowBgColor1: 'rgba(6, 21, 31, .2)',
    rowBgColor2: 'rgba(6, 21, 31, .35)'
  }
}

export const helpList = [{
  group: '游戏面板与信息查询',
  list: [{
    icon: 61,
    title: '#角色 #角色卡片 #探索',
    desc: '你的原神角色数据，数据来自米游社'
  }, {
    icon: 63,
    title: '#面板 #更新面板',
    desc: '查看已经获取面板信息的角色列表'
  }, {
    icon: 66,
    title: '#雷神面板 #雷神伤害',
    desc: '查看角色详细面板及伤害信息'
  }, {
    icon: 65,
    title: '#圣遗物列表 #雷神圣遗物',
    desc: '查看圣遗物列表 / 评分详情'
  }, {
    icon: 79,
    title: '#面板帮助',
    desc: '面板替换及其他帮助信息'
  }, {
    icon: 64,
    title: '#深渊 #深渊12层',
    desc: '深渊数据，打完请2小时后查询'
  }, {
    icon: 67,
    title: '#五星 #武器 #今日素材',
    desc: '你的原神角色详情数据'
  }, {
    icon: 62,
    title: '#五星列表 #练度统计',
    desc: '角色列表数据'
  }, {
    icon: 77,
    title: '#上传深渊数据',
    desc: '上传您的深渊数据用于数据统计'
  }]
}, {
  group: '资料及图片',
  list: [{
    icon: 58,
    title: '#刻晴 #心海',
    desc: '你的原神角色卡片'
  }, {
    icon: 59,
    title: '#老婆 #老公',
    desc: '查看老婆、老公'
  }, {
    icon: 60,
    title: '#老婆设置心海,雷神',
    desc: '设置老婆列表，也可设置随机'
  }, {
    icon: 88,
    title: '#老婆照片 #甘雨照片',
    desc: '查看指定角色的图片'
  }, {
    icon: 53,
    title: '#夜兰天赋 #胡桃命座',
    desc: '查看角色的天赋与命座资料'
  }, {
    icon: 56,
    title: '#深渊配队',
    desc: '根据你的角色池推荐组队'
  }, {
    icon: 78,
    title: '#角色持有 #角色0命',
    desc: '查看角色的持有率、0命统计'
  }, {
    icon: 77,
    title: '#深渊使用率 #深渊出场率',
    desc: '查看本期深渊使用或出场统计'
  }, {
    icon: 20,
    title: '#刻晴攻略',
    desc: '西风驿站攻略'
  }, {
    icon: 60,
    title: '#心海图鉴 #护摩',
    desc: '角色武器图鉴'
  }]
}, {
  group: '个人信息查询及签到',
  desc: '需要绑定cookie',
  list: [{
    icon: 15,
    title: '#体力 #体力帮助',
    desc: '查询体力，绑定Cookie帮助'
  }, {
    icon: 5,
    title: '#原石 #原石统计',
    desc: '札记数据，需要绑定Cookie'
  }, {
    icon: 10,
    title: '#uid #绑定123456789',
    desc: '查看绑定的uid 绑定uid'
  }, {
    icon: 22,
    title: '#我的ck #删除ck',
    desc: '查看绑定的cookie 删除cookie'
  }, {
    icon: 86,
    title: '#签到',
    desc: '米游社原神签到'
  }]
}, {
  group: '其他查询指令',
  list: [{
    icon: 83,
    title: '#日历 #日历列表',
    desc: '查看活动日历'
  }, {
    icon: 6,
    title: '#抽卡记录 #记录帮助',
    desc: '统计游戏抽卡数据'
  }, {
    icon: 21,
    title: '#角色统计 #武器统计',
    desc: '按卡池统计抽卡数据'
  }, {
    icon: 8,
    title: '十连 十连2 定轨',
    desc: '真实模拟抽卡'
  }, {
    icon: 74,
    title: '添加哈哈 删除哈哈',
    desc: '添加表情，回复哈哈触发'
  }, {
    icon: 79,
    title: '#帮助 #版本 #喵喵版本',
    desc: '其他命令'
  }]
}, {
  group: '管理命令，仅管理员可用',
  auth: 'master',
  list: [{
    icon: 85,
    title: '#用户统计',
    desc: '查看用户CK-UID列表'
  }, {
    icon: 32,
    title: '#喵喵设置',
    desc: '配置喵喵功能'
  }, {
    icon: 35,
    title: '#喵喵更新图像',
    desc: '更新喵喵的增量角色图像素材'
  }]
}]

export const isSys = true
