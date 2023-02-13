export const cfgSchema = {
  apps: {
    title: 'Yunzai功能（开启使用喵喵版功能）',
    cfg: {
      avatarList: {
        title: '#角色 #UID',
        key: '角色列表',
        def: false
      },
      avatarCard: {
        title: '#刻晴 #老婆',
        key: '角色卡片',
        def: true
      },
      uploadAbyssData: {
        title: '#深渊',
        key: '深渊',
        def: false
      },
      profileStat: {
        title: '#练度统计',
        key: '练度统计',
        def: false
      },
      help: {
        title: '#帮助 #菜单',
        key: '帮助',
        def: false
      },
      avatarPoke: {
        title: '戳一戳展示角色卡片',
        key: '戳一戳',
        def: true
      }
    }
  },
  profile: {
    title: '角色面板相关设置',
    cfg: {
      avatarProfile: {
        title: '面板查询',
        key: '面板查询',
        def: true
      },
      profileChange: {
        title: '面板替换',
        key: '面板替换',
        def: true
      },
      groupRank: {
        title: '群面板排名',
        key: '排名',
        def: false,
        desc: '群内的面板伤害及圣遗物排名与查看功能，默认关闭。请根据群友心理素质自行决定是否开启'
      },
      groupRankLimit: {
        title: '排名限制',
        key: '限制',
        def: 1,
        type: 'num',
        desc: '参与排名的限制条件：1:无限制 2:有CK 3:有16个角色或有CK 4:有御三家(安柏&凯亚&丽莎)或有CK 5:有16个角色+御三家或有CK。 若改变设置请根据情况决定是否需要【#重置排名】'
      },
      rankNumber: {
        title: '排行人数',
        key: '排行人数',
        type: 'num',
        def: 15,
        input: (n) => Math.min(30, Math.max(5, (n * 1 || 15))),
        desc: '可选值5~30，建议15。设置高排名人数会提高图片的长度，图片较大可能会影响渲染与发送速度'
      },
      profileServ: {
        title: '面板服务',
        key: '面板服务',
        type: 'num',
        def: 1,
        input: (n) => n * 1 === 1 ? 1 : 2,
        desc: '面板服务优先选择：1：自动（具备有效Token时优先喵喵Api，否则Enka），2：Enka服务优先'
      },
      teamCalc: {
        title: '组队加成伤害',
        key: '组队',
        def: false,
        desc: '伤害计算包含组队Buff。目前为测试阶段，数据可能不准确，请慎重开启。数据为固定Buff而非真实面板数据，最终计算数值可能有偏差。开启后请重启喵喵'
      },
      artisNumber: {
        title: '圣遗物列表数量',
        key: '圣遗物数量',
        type: 'num',
        def: 28,
        input: (n) => Math.min(100, Math.max(4, (n * 1 || 28))),
        desc: '可选值4~100，建议28，最终圣遗物数量取决于面板内圣遗物数量。设置高圣遗物数量会提高图片的长度，图片较大可能会影响渲染与发送速度'
      }
    }
  },
  wiki: {
    title: '角色资料与信息查询',
    cfg: {
      charWiki: {
        title: '角色图鉴-图鉴',
        key: '图鉴',
        def: true,
        showDesc: false,
        desc: '#刻晴图鉴 的图鉴信息'
      },
      charWikiTalent: {
        title: '角色图鉴-天赋',
        key: '天赋',
        def: true,
        showDesc: false,
        desc: '#刻晴天赋/#刻晴命座 的天赋信息'
      },
      notReleasedData: {
        title: '未实装角色数据',
        key: '未实装',
        def: true
      },
      charPic: {
        title: '角色图片',
        key: '图片',
        def: true
      },
      charPicSe: {
        title: '小清新角色图',
        key: '小清新',
        def: false,
        desc: '启用后会启用角色图及增量包中的小清新图像，勇士啊，你准备好了吗'
      }
    }
  },
  sys: {
    title: '系统设置',
    cfg: {
      renderScale: {
        title: '渲染精度',
        key: '渲染',
        type: 'num',
        def: 100,
        input: (n) => Math.min(200, Math.max(50, (n * 1 || 100))),
        desc: '可选值50~200，建议100。设置高精度会提高图片的精细度，但因图片较大可能会影响渲染与发送速度'
      },
      commaGroup: {
        title: '数字逗号分组',
        key: '逗号',
        def: 3,
        type: 'num',
        desc: '根据语言习惯设置数字分组，如千位组设为3，万位组设为4'
      }
    }
  }

}
