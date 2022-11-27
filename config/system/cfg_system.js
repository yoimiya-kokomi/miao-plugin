export const cfgSchema = {
  char: {
    title: '玩家&老婆卡片展示',
    cfg: {
      avatarCard: {
        title: '角色查询',
        key: '角色',
        def: true,
        desc: '使用喵喵版角色卡片作为默认角色卡片功能',
        showDesc: false,
        oldCfgKey: 'char.char'
      },
      avatarProfile: {
        title: '面板查询',
        key: '面板',
        def: true,
        oldCfgKey: 'char.profile'
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
      uploadAbyssData: {
        title: '上传深渊',
        key: '深渊',
        def: false,
        oldCfgKey: 'wiki.abyss',
        desc: '使用【#上传深渊】功能取代【#深渊功能】,默认关闭'
      },
      avatarWife: {
        title: '老婆查询',
        key: '老婆',
        def: true,
        oldCfgKey: 'char.wife'
      },
      avatarPoke: {
        title: '戳一戳卡片',
        key: '戳一戳',
        def: true,
        oldCfgKey: 'char.poke'
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
        oldCfgKey: 'wiki.wiki',
        showDesc: false,
        desc: '#刻晴天赋/#刻晴命座 的天赋信息'
      },
      charPic: {
        title: '角色图片',
        key: '图片',
        def: true,
        oldCfgKey: 'wiki.pic'
      },
      charPicSe: {
        title: '小清新角色图',
        key: '小清新',
        def: false,
        oldCfgKey: 'char.se',
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
        oldCfgKey: 'sys.scale',
        desc: '可选值50~200，建议100。设置高精度会提高图片的精细度，但因图片较大可能会影响渲染与发送速度'
      },
      help: {
        title: '喵喵作为默认帮助',
        key: '帮助',
        def: false,
        oldCfgKey: 'sys.help',
        desc: '开启后将使用喵喵版帮助作为Yunzai的默认帮助，默认关闭'
      },
      commaGroup: {
        title: '数字逗号分组',
        key: '逗号',
        def: 3,
        type: 'num',
        desc: '根据语言习惯设置数字分组，如千位组设为3，万位组设为4'
      },
      attrCalc: {
        title: '面板计算属性',
        key: '计算',
        def: false,
        desc: '使用基于武器&圣遗物计算的面板属性取代服务读取的面板数据，可规避双水buff等导致的一些面板数据错误。开启后部分角色属性可能会轻微变化，请根据需求开启关闭'
      }
    }
  }

}
