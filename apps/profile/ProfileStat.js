import { Common, Cfg } from '#miao'
import { MysApi, Player, Character } from '#miao.models'
import moment from 'moment'
import lodash from 'lodash'
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

const ProfileStat = {
  async stat (e) {
    return ProfileStat.render(e, 'stat', false)
  },

  async roleStat(e) {
    return ProfileStat.render(e, 'stat', true)
  },

  async avatarList (e) {
    return ProfileStat.render(e, 'avatar')
  },

  async refreshTalent (e) {
    let game = /星铁/.test(e.msg) ? 'sr' : 'gs'
    e.isSr = game === 'sr'

    let mys = await MysApi.init(e)
    if (!mys || !mys.uid) return false

    let player = Player.create(e, game)
    let refreshCount = await player.refreshTalent('', 2)
    if (refreshCount && !e.isSr) {
      e.reply(`角色天赋更新成功，共${refreshCount}个角色\n你现在可以通过【#练度统计】【#天赋统计】来查看角色信息了...`)
    } else if (e.isSr) {
      e.reply(`角色行迹更新成功，共${refreshCount}个角色\n你现在可以通过【*练度统计】来查看角色信息了...`)
    } else {
      e.reply('角色天赋未能更新...')
    }
  },

  getStarFilterFunc(e) {
    let msg = e.msg.replace(/#星铁|#/, '').trim()

    // starFilter: 检测是否有星级筛选
    let requiredStar = 0
    if (/(五|四|5|4|)+星/.test(msg)) {
      requiredStar = /(五|5)+星/.test(msg) ? 5 : 4
    }
    let starFilter = ds => true;
    if (requiredStar) {
      starFilter = ds => ds.star === requiredStar
    }
    return starFilter
  },

  getElementFilerFromElements(requiredElements) {
    return ds => requiredElements.includes(ds.elem)
  },

  getIdFilterFunc(requiredIds) {
    return ds => requiredIds.includes(ds.id)
  },

  getElementFilterFunc(e) {
    let msg = e.msg.replace(/#星铁|#/, '').trim()

    // elementFilter: 检测是否有元素筛选
    let requiredElements = []
    let chineseToEnglishElements = {}
    if (e.isSr) {
      // 先给星铁的元素筛选留空
    } else {
      chineseToEnglishElements = {
        '风': 'anemo',
        '岩': 'geo',
        '雷': 'electro',
        '草': 'dendro',
        '水': 'hydro',
        '火': 'pyro',
        '冰': 'cryo'
      }
    }
    for (let [k, v] of Object.entries(chineseToEnglishElements)) {
      // 如果后续需支持星铁，这里可能也要用到正则判断
      // e.g. 物(理)?  量(子)?  虚(数)?
      if (msg.includes(k)) {
        requiredElements.push(v)
      }
    }
    let elementFilter = ds => true;
    if (requiredElements.length > 0) {
      elementFilter = ProfileStat.getElementFilerFromElements(requiredElements)
    }
    return elementFilter
  },

  getFilterFunc(e) {
    let starFilter = ProfileStat.getStarFilterFunc(e)
    let elementFilter = ProfileStat.getElementFilterFunc(e)
    
    // 组合函数
    let combinedFilter = lodash.overEvery([starFilter, elementFilter])
    return combinedFilter
  },

  getRoleFilterFunc(e, elements, invitationCharacterIds) {
    let invitationCharacterFilter = ProfileStat.getIdFilterFunc(invitationCharacterIds)
    let elementFilter = ProfileStat.getElementFilerFromElements(elements)
    
    // 组合函数
    let combinedFilter = lodash.overSome([invitationCharacterFilter, elementFilter])
    let levelFilter = ProfileStat.getLevelFilterFunc()
    combinedFilter = lodash.overEvery([combinedFilter, levelFilter])
    return combinedFilter
  },

  getLevelFilterFunc() {
    return ds => ds.level >= 70
  },

  async fetchWithTimeout(url, options = {}) {
    const { timeout = 5000 } = options; // 默认超时时间为 5 秒
  
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
  
    clearTimeout(id);
  
    return response;
  },

  async getOverallMazeData() {
    const request_url = 'https://homdgcat.wiki/gi/CH/maze.js'
    let resData = false
    try {
        resData = await (await ProfileStat.fetchWithTimeout(request_url)).text()
    } catch (error) {
        logger.error('请求失败:', error)
        return false // 直接返回以停止后续逻辑
    }
    const match = /var _overall = (.*?)var/s.exec(resData)
    let overallMazeInfo = []
    if (match) {
      overallMazeInfo = JSON.parse(match[1])
    } else {
      logger.error('响应内容格式不对劲')
      return false
    }

    return overallMazeInfo
  },

  sendRoleCombatInfo(e, elements, initialCharacterIds, invitationCharacterIds) {
    const response = [
      ProfileStat.getElementInfo(elements),
      ProfileStat.getInitialCharacterInfo(initialCharacterIds),
      ProfileStat.getInvitationCharacterInfo(invitationCharacterIds),
    ].join('\n')
    e.reply(response)
  },

  getElementInfo(elements) {
    // 让我们说中文！
    const englishToChineseElements = {
      'anemo': '风',
      'geo': '岩',
      'electro': '雷',
      'dendro': '草',
      'hydro': '水',
      'pyro': '火',
      'cryo': '冰'
    }
    // 使用 lodash 将元素转换为中文名称，并用'、'组合成'风、岩'
    const chineseElements = lodash.map(elements, (element) => englishToChineseElements[element]).join('、');
    return `限制元素：${chineseElements}`
  },

  getInitialCharacterInfo(initialCharacterIds) {
    let characters = lodash.compact(lodash.map(initialCharacterIds, (id) => Character.get(id)))
    let characterNames = lodash.map(characters, (character) => character.name).join('、')
    return `开幕角色：${characterNames}`
  },

  getInvitationCharacterInfo(invitationCharacterIds) {
    let characters = lodash.compact(lodash.map(invitationCharacterIds, (id) => Character.get(id)))
    let characterNames = lodash.map(characters, (character) => character.name).join('、')
    return `特邀角色：${characterNames}`
  },

  // TODO: BWiki 源的数据暂时没弄完，没接入逻辑中，暂时没啥必要？
  async getOverallMazeLinkFromBWiki() {
    const request_url = 'https://wiki.biligame.com/ys/%E5%B9%BB%E6%83%B3%E7%9C%9F%E5%A2%83%E5%89%A7%E8%AF%97'
    try {
      // 发送 GET 请求
      const html = await (await ProfileStat.fetchWithTimeout(request_url)).text()

      // 加载 HTML
      const $ = cheerio.load(html);

      // 存储 href 属性的数组
      const links = [];

      // 查找 id="每期详情" 下的所有 <a> 标签
      $('#每期详情').closest('h2').next('p').find('a').each((index, element) => {
          const href = $(element).attr('href');
          if (href) {
              links.push(href);
          }
      });

      return links
    } catch (error) {
      console.error('Error fetching the URL:', error.message);
    }
  },

  async getRequestedMazeDataFromBWiki(e, links) {
    const mazeId = ProfileStat.getMazeId(e)
    if (mazeId >= 0 && mazeId < links.length) {
      const request_url = `https://wiki.biligame.com/${links[mazeId]}`

      // 发送 GET 请求
      const html = await (await ProfileStat.fetchWithTimeout(request_url)).text()

      // 加载 HTML
      const $ = cheerio.load(html);

      // 存储 href 属性的数组
      const elements = [];

      $('#限定元素').closest('h2').next('p').find('img').each((index, element) => {
          const alt = $(element).attr('alt');
          const match = /卡牌UI\-元素\-(.*?)\.png/.exec(alt);
          if (match) {
              elements.push(match[1]);
          }
      });
      
      // 转换成和 HomDGCat 相同的格式
      const elementConvertingMapping = {
        '风': 'Wind',
        '岩': 'Rock',
        '雷': 'Elec',
        '草': 'Grass',
        '水': 'Water',
        '火': 'Fire',
        '冰': 'Ice'
      }
      const convertedElements = lodash.map(elements, (element) => elementConvertingMapping[element])

      // 存储开幕角色的数组
      const initialAvatarIds = [];

      $('#开幕角色').closest('h2').next('p').children('a').each((index, element) => {
          const avatarName = $(element).text();
          const avatarId = Character.get(avatarName).id 
          initialAvatarIds.push(avatarId);
      });

      // 转换成和 HomDGCat 相同的格式
      const convertedInitialAvatarIds = lodash.map(initialAvatarIds, (id) => ({'ID': id - 10000000}))

      // 存储特邀角色的数组
      const invitationAvatarIds = [];

      $('#特邀角色').closest('h2').next('p').children('a').each((index, element) => {
          const avatarName = $(element).text();
          const avatarId = Character.get(avatarName).id 
          invitationAvatarIds.push(avatarId);
      });

      // 转换成和 HomDGCat 相同的格式
      const convertedInvitationAvatarIds = lodash.map(invitationAvatarIds, (id) => ({'ID': id - 10000000}))

      return {
        'Initial': convertedInitialAvatarIds,
        'Invitation': convertedInvitationAvatarIds,
        'Elem': convertedElements
      }
    } else {
      return false
    }
  },

  getMazeId(e) {
    const match = /202(\d{3})/.exec(e.msg)
    if (!match) {
      return false
    }
    const num = +match[1]
    const numYear = Math.floor(num / 100)
    const numMonth = num % 100
    const newNum = numYear * 12 + numMonth - 1
    const mazeId = newNum - (4 * 12 + 7 - 1)
    return mazeId
  },

  extractRequestedMazeData(e, overallMazeData) {
    const mazeId = ProfileStat.getMazeId(e)
    if (mazeId >= 0 && mazeId < overallMazeData.length) {
      return overallMazeData[mazeId]
    } else {
      return false
    }
  },

  extractInitialCharacterIds(mazeData) {
    return lodash.map(mazeData.Initial, item => item.ID + 10000000);
  },

  extractInvitationCharacterIds(mazeData) {
    return lodash.map(mazeData.Invitation, item => item.ID + 10000000);
  },

  extractElements(mazeData) {
    const elementMap = {
      'Wind': 'anemo',
      'Rock': 'geo',
      'Elec': 'electro',
      'Grass': 'dendro',
      'Water': 'hydro',
      'Fire': 'pyro',
      'Ice': 'cryo'
    }
    return lodash.map(mazeData.Elem, item => elementMap[item]);
  },

  mergeStart (avatars, initialAvatarIds) {
    let initialAvatars = []
    lodash.forEach(initialAvatarIds, (id) => {
      let char = Character.get(id)
      if (char) {
        initialAvatars.push({
          id: id,
          name: char.name,
          elem: char.elem,
          abbr: char.abbr,
          star: char.star,
          face: char.face,
          level: 80,
          cons: 0,
          talent: {
            a: {
              level: 8,
              original: 8
            },
            e: {
              level: 8,
              original: 8
            },
            q: {
              level: 8,
              original: 8
            }
          }
        })
      }
    })

    // mergedAvatars: 求 avatars 和 initialAvatars 的并集
    // 判断标准为这些元素的 id 属性
    // 如果 avatars 和 initialAvatars 中的元素 id 属性相同，则比较这两个元素的 level 属性，
    // 选取 level 较大的那个元素放入 mergedAvatars
    // 注意：即使 avatars 和 initialAvatars 中的元素除了 id 属性相同，其他属性完全不同，
    // 但在 id 属性相同的情况下，仍需放入整个元素
    let mergedAvatars = []
    
    // 合并逻辑实现
    let avatarMap = new Map();

    // 遍历 avatars，将每个元素加入到 avatarMap 中
    avatars.forEach(avatar => {
        avatarMap.set(avatar.id, avatar);
    });

    // 遍历 initialAvatars，进行合并
    initialAvatars.forEach(initialAvatar => {
        if (avatarMap.has(initialAvatar.id)) {
            // 如果 id 相同，比较 level，选取较大的元素
            let existingAvatar = avatarMap.get(initialAvatar.id);
            avatarMap.set(initialAvatar.id, 
                existingAvatar.level >= initialAvatar.level ? existingAvatar : initialAvatar);
        } else {
            // 如果 id 不同，直接加入
            avatarMap.set(initialAvatar.id, initialAvatar);
        }
    });

    // 将合并后的结果转换为数组并返回
    mergedAvatars = Array.from(avatarMap.values());

    // 排序
    // 按照元素进行区分
    let sortKey = 'elem,level,star,aeq,cons,weapon.level,weapon.star,weapon.affix,fetter'.split(',')
    mergedAvatars = lodash.orderBy(mergedAvatars, sortKey)
    mergedAvatars = mergedAvatars.reverse()

    return mergedAvatars;
  },

  // 渲染
  // mode stat:练度统计 avatar:角色列表 talent:天赋统计
  async render (e, mode = 'stat', isRole = false) {
    let game = /星铁/.test(e.msg) ? 'sr' : 'gs'
    e.isSr = game === 'sr'
    e.game = game

    // 缓存时间，单位小时
    let msg = e.msg.replace(/#星铁|#/, '').trim()
    if (msg === '角色统计' || msg === '武器统计') {
      // 暂时避让一下抽卡分析的关键词
      return false
    }

    if (/天赋|技能/.test(msg)) {
      mode = 'talent'
    }

    let mys = await MysApi.init(e)
    if (!mys || !mys.uid) return false

    const uid = mys.uid

    let player = Player.create(e, game)

    let avatarRet = await player.refreshAndGetAvatarData({
      index: 2,
      detail: 1,
      talent: mode === 'avatar' ? 0 : 1,
      rank: true,
      materials: mode === 'talent',
      retType: 'array',
      sort: true
    })

    if (avatarRet.length === 0) {
      e._isReplyed || e.reply(`查询失败，暂未获得#${uid}角色数据，请绑定CK或 #更新面板`)
      return true
    }

    
    let filterFunc = (x) => true
    if (isRole) {
      let c = Cfg.get('roleCharInfoSource', 1)
      let datasetName
      let overallMazeData
      if (c == 1) {
        datasetName = 'HomDGCat'
        overallMazeData = await ProfileStat.getOverallMazeData() // data
      } else if (c == 2) {
        datasetName = 'BWiki'
        overallMazeData = await ProfileStat.getOverallMazeLinkFromBWiki() // links
      }
      if (!overallMazeData) {
        e.reply(`请求 ${datasetName} 数据库出错`)
        return false
      }
      let currentMazeData
      if (c == 1) {
        currentMazeData = ProfileStat.extractRequestedMazeData(e, overallMazeData)
      } else if (c == 2) {
        currentMazeData = await ProfileStat.getRequestedMazeDataFromBWiki(e, overallMazeData)
      }
      if (!currentMazeData) {
        const n = overallMazeData.length - 1 + 4 * 12 + 7 - 1
        const maxYear = Math.floor(n / 12)
        const maxMonth = n % 12 + 1
        const formattedMonth = String(maxMonth).padStart(2, '0'); // 将月份格式化为两位数
        const response = [
          `当前月份不在 ${datasetName} 数据库中，请考虑在设置中更换幻想数据库`,
          `${datasetName} 数据库目前可供查询的月份：202407 - 202${maxYear}${formattedMonth}`
        ].join('\n')
        e.reply(response)
        return false
      }
      let initialCharacterIds = ProfileStat.extractInitialCharacterIds(currentMazeData)
      let invitationCharacterIds = ProfileStat.extractInvitationCharacterIds(currentMazeData)
      let elements = ProfileStat.extractElements(currentMazeData)
      
      // 发送简要的信息
      ProfileStat.sendRoleCombatInfo(e, elements, initialCharacterIds, invitationCharacterIds)

      avatarRet = ProfileStat.mergeStart(avatarRet, initialCharacterIds)
      filterFunc = ProfileStat.getRoleFilterFunc(e, elements, invitationCharacterIds)
    } else {
      filterFunc = ProfileStat.getFilterFunc(e)
    }
    avatarRet = lodash.filter(avatarRet, filterFunc)

    let now = moment(new Date())
    if (now.hour() < 4) {
      now = now.add(-1, 'days')
    }
    let week = now.weekday()

    if (mode === 'talent') {
      let weekRet = /周([1-6]|一|二|三|四|五|六)/.exec(msg)
      let weekSel = weekRet?.[1]
      if (/(今日|今天)/.test(msg)) {
        weekSel = week + 1
      } else if (/(明天|明日)/.test(msg)) {
        now = now.add(1, 'days')
        weekSel = now.weekday() + 1
      }
      let weekFilter = (weekSel * 1) || ('一二三四五六'.split('').indexOf(weekSel) + 1)
      if (weekFilter && weekFilter !== 7) {
        avatarRet = lodash.filter(avatarRet, ds => ds?.materials?.talent?.num === ['周一/周四', '周二/周五', '周三/周六'][(weekFilter - 1) % 3])
      }
    }

    let faceChar = Character.get(player.face) || Character.get(avatarRet[0]?.id)
    let imgs = faceChar.imgs
    let face = {
      banner: imgs?.banner,
      face: imgs?.face,
      qFace: imgs?.qFace,
      name: player.name || `#${uid}`,
      sign: player.sign,
      level: player.level
    }

    let info = player.getInfo()
    info.stats = info.stats || {}
    info.statMap = {
      achievement: '成就',
      wayPoint: '锚点',
      avatar: '角色',
      avatar5: '五星角色',
      goldCount: '金卡总数'
    }

    let tpl = mode === 'avatar' ? 'character/avatar-list' : 'character/profile-stat'
    return await Common.render(tpl, {
      save_id: uid,
      uid,
      info,
      updateTime: player.getUpdateTime(),
      isSelfCookie: e.isSelfCookie,
      face,
      mode,
      week,
      avatars: avatarRet,
      game
    }, { e, scale: 1.4 })
  }
}
export default ProfileStat
