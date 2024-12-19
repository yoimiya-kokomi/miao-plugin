import lodash from 'lodash'
import fetch from 'node-fetch'
import moment from 'moment'
import Calendar from './Calendar.js'
import { Common, Data } from '#miao'

const ignoreIds = [
  238, // 绳网认证分部一览
  239, // 公平运营声明
  242, // 防沉迷系统公告
  307, // 米游社《绝区零》专属工具一览
  532, // 已知问题及游戏优化说明
]

const ignoreReg = /(测试1|测试2|养成指南|签到福利|绘画征集|活动日历|新品情报|更新说明|预约活动|云·绝区零|新剧情|问题修复|已知问题|攻略征集|丽都殊荣|商城)/

const testReg = /(活动时间|活动说明|调频|测试开启|开放时间|开启时间|折扣时间|上架时间)/

let CalZZZ = {
  async reqCalData() {
    let listApi = 'https://announcement-api.mihoyo.com/common/nap_cn/announcement/api/getAnnList?game=nap&game_biz=nap_cn&lang=zh-cn&bundle_id=nap_cn&channel_id=1&level=70&platform=pc&region=prod_gf_cn&uid=12345678'

    let request = await fetch(listApi)
    let listData = await request.json()

    let timeMap
    let timeMapCache = await redis.get('miao:calendarZZZ:detail')
    let gachaImgs
    let gachaImgsCache = await redis.get('miao:calendarZZZ:gachaImgs')
    if (timeMapCache && gachaImgsCache) {
      //logger.info(`正在使用离线时间表`)
      timeMap = JSON.parse(timeMapCache) || {}
      gachaImgs = JSON.parse(gachaImgsCache) || {}
    } else {
      
      //logger.info(`正在获取在线时间表`)
      let detailApi =`https://announcement-static.mihoyo.com/common/nap_cn/announcement/api/getAnnContent?game=nap&game_biz=nap_cn&lang=zh-cn&bundle_id=nap_cn&platform=pc&region=prod_gf_cn&level=70&channel_id=1`
      let request2 = await fetch(detailApi)
      let detailData = await request2.json()
      timeMap = {}
      if (detailData && detailData.data && detailData.data.list) {
        let versionTime = {
          1.1: '2024-08-14 11:00:00'
        }
        lodash.forEach(detailData.data.list, (ds) => {
          ds.title = ds.title.replace(/(<|&lt;)[\w "%:;=\-\\/\\(\\),\\.]+(>|&gt;)/g, '')
          ds.title = ds.title.replace(/(&amp;)/g, '&')
          ds.content = ds.content.replace(/(<|&lt;)[\w "%:;=\-\\/\\(\\),\\.]+(>|&gt;)/g, '')
          ds.content = ds.content.replace(/(（服务器时间）|【|】)/g, '')
          //logger.info(`detail标题读取：${ds.title}`)
          //从版本更新公告获取版本时间
          let vRet = /(\d\.\d)版本更新(?:概览|说明)/.exec(ds.subtitle)
          if (vRet && vRet[1]) {
            //logger.info(`版本更新：${ds.subtitle}`)
            let contentTime = /(?:更新开始时间)(([0-9\\/\\: ]){19,})/.exec(ds.content)
            if (contentTime && contentTime[1]) {
            //logger.info(`读取到更新开始时间：`)
            //logger.info(`${contentTime[1]}`)
            contentTime[1]= contentTime[1].replace(/\//g, '-')
              let tRet = /(([0-9\\/\\: -]){19,})/.exec(contentTime[1])
              if (tRet && tRet[0]) {
                //logger.info(`读取到的版本时间：${tRet}`)
                versionTime[vRet[1]] = versionTime[vRet[1]] || tRet[0].replace('06:00', '11:00')
                //logger.info(`写入的的版本时间：${versionTime[vRet[1]]}`)
              }
            }else{
              //logger.info(`content中未找到版本时间信息`)
            }
          }else if(!vRet){
            //logger.info(`title中未找到版本信息`)
          }
          //版本交接时候，从预下载公告获取下版本时间
          let preDLRet = /(\d\.\d)版本「(?:.*?)」预下载/.exec(ds.title)
          if (preDLRet && preDLRet[1]) {
            //logger.info(`版本预下载：${ds.subtitle}`)
            let contentTime = /(?:预下载时间)(([0-9\\/\\: ~]){19,})/.exec(ds.content)
            if (contentTime && contentTime[1]) {
            //logger.info(`读取到预下载时间：`)
            //logger.info(`${contentTime[1]}`)
            contentTime[1]= contentTime[1].replace(/\//g, '-')
            let splitTime= contentTime[1].split('~')
              let tRet = /(([0-9\\/\\: -]){9,})/.exec(splitTime[1])
              if (tRet && tRet[1]) {
                //logger.info(`读取到的版本预下载时间：${tRet}`)
                versionTime[preDLRet[1]] = versionTime[preDLRet[1]] || tRet[1].replace('5:50', '11:00:00')
                //logger.info(`写入的预下载版本时间：${versionTime[preDLRet[1]]}`)
              }
            }else{
              //logger.info(`content中未找到预下载版本时间信息`)
            }
          }else if(!preDLRet){
            //logger.info(`title中未找到预下载版本信息`)
          }
        })

        gachaImgs = []
        let ret = function (ds) {
          let { ann_id: annId, content, title } = ds
          title = title.replace(/(<|&lt;)[\w "%:;=\-\\/\\(\\),\\.]+(>|&gt;)/g, '')
          if (ignoreReg.test(title)) {
            //logger.info(`标题关键词排除：${title}`)
            return true
          }
          //content = content.replaceAll('\u003ch1 style=\"\"\u003e', '※')
          //content = content.replaceAll('\u003c/h1\u003e', '※')
          content = content.replace(/(<|&lt;)[\w "%:;=\-\\/\\(\\),\\.]+(>|&gt;)/g, '')
          content = content.replace(/(（服务器时间）|【|】)/g, '')
          let contentexec
          contentexec = /(活动时间|活动说明|调频|测试开启|开放时间|开启时间|折扣时间|上架时间)/.exec(content)
          
          /*
          if (testReg.test(content)) {
            //logger.info(`内容关键词检测：${title}`)
          }
          */
          
          
          if (!contentexec || !contentexec[1]) {
            ////logger.info(`无 contentexec 返回：${annId},${title}`)
            //return true
          }else{
            //logger.info(`有 contentexec 返回：${annId},${title}`)
          }

          
          //
          if (/调频/.test(content)) {
            //logger.info(`调频：${annId},${title}`)
            gachaImgs.push(ds.banner)
          }
          //contentexec = contentexec[1]
          let annTime = []
          

          // 第一种简单格式
          let timeRet = /(?:活动时间)(?:※|\s|：)*([0-9\\/\\: ~]{6,})/.exec(content)
          if (/\d\.\d版本更新后/.test(content)) {
            //logger.info(`${annId},${title}检测到 版本更新后`)
            let vRet = /(\d\.\d)版本更新后/.exec(content)
            let vTime = ''
            if (vRet && vRet[1] && versionTime[vRet[1]]) {
              vTime = versionTime[vRet[1]]
              //logger.info(`vTime:获取版本时间`)
            }
            if (!vTime) {
              //logger.info(`vTime:缺少版本时间`)
              return true
            }
            if (/永久/.test(content)) {
              //logger.info(`${annId},${title}检测到 永久`)
              annTime = [vTime, '2099/01/01 00:00:00']
            } else {
              timeRet = /([0-9\\/\\: ]){9,}/.exec(content)
              if (timeRet && timeRet[0]) {
                annTime = [vTime, timeRet[0]]
              }
            }
          } else if (/预下载/.test(content)) {
            //logger.info(`${annId},${title}检测到 预下载`)
            timeRet = /([0-9\\/\\: ~]){9,}/.exec(content)
            annTime = timeRet[0].split('~')
            annTime[0]=moment(annTime[0]).subtract(5, 'days').format('YYYY-MM-DD HH:mm:ss')
          } else if (/调频/.test(content)) {
            //logger.info(`${annId},${title}检测到 调频`)
            timeRet = /(?:活动时间限定)(?:.*?)((?:[0-9\\/\\: ~]){9,})/.exec(content)
            annTime = timeRet[1].split('~')
          } else if (/卓越搭档/.test(content)) {
            //logger.info(`${annId},${title}检测到 卓越搭档`)
            timeRet = /(?:活动时间限定)(?:.*?)((?:[0-9\\/\\: ~]){9,})/.exec(content)
            annTime = timeRet[1].split('~')
          } else if (timeRet && timeRet[1]) {
            //logger.info(`${annId},${title}检测到 活动时间`)
            //logger.info(`${timeRet[1]}`)
            annTime = timeRet[1].split('~')
          }

          if (annTime.length === 2) {
            //logger.info(`当前时间映射表公告id:${annId}`)
            //logger.info(`${annTime[0]},${annTime[1]}`)
            timeMap[annId] = {
              start: annTime[0].trim().replace(/\//g, '-'),
              end: annTime[1].trim().replace(/\//g, '-')
            }
            //logger.info(`时间映射表：${timeMap[annId].start},${timeMap[annId].end}`)
          }
        }
        lodash.forEach(detailData.data.list, (ds) => ret(ds))
        lodash.forEach(detailData.data.pic_list, (ds) => ret(ds))
      }
      await Data.setCacheJSON('miao:calendarZZZ:detail', timeMap, 60 * 10)
    }
        //
    //
    let detailApi =`https://announcement-static.mihoyo.com/common/nap_cn/announcement/api/getAnnContent?game=nap&game_biz=nap_cn&lang=zh-cn&bundle_id=nap_cn&platform=pc&region=prod_gf_cn&level=70&channel_id=1`
    let request2 = await fetch(detailApi)
    let detailData = await request2.json()
    //
    //
    return { listData, detailData, timeMap, gachaImgs }
  },

  // 深渊日历信息
  getAbyssCal(s1, e1, versionStartTime) {
    let check = []
    let f = 'YYYY-MM-DD HH:mm:ss'
    let newAbyssStart = moment('2024-12-27 04:00:00')

    let abyss1Start = moment(versionStartTime, 'YYYY-MM-DD HH:mm:ss').day(0).hours(4).format(f)

    let diff0 = Math.abs(newAbyssStart.diff(abyss1Start, 'days') % 14)
    if (diff0 !== 0) {
      abyss1Start = moment(abyss1Start).subtract(diff0, 'days').format(f)
    }

    let abyss1End = moment(abyss1Start).add(14, 'days').format(f)
    let abyss2Start = moment(abyss1Start).add(14, 'days').format(f)
    let abyss2End = moment(abyss2Start).add(14, 'days').format(f)
    let abyss3Start = moment(abyss2Start).add(14, 'days').format(f)
    let abyss3End = moment(abyss3Start).add(14, 'days').format(f)
    let abyss4Start = moment(abyss3Start).add(14, 'days').format(f)
    let abyss4End = moment(abyss4Start).add(14, 'days').format(f)
    let abyss5Start = moment(abyss4Start).add(14, 'days').format(f)
    let abyss5End = moment(abyss5Start).add(14, 'days').format(f)

    let abyss0Start = moment(abyss1Start).subtract(14, 'days').format(f)
    let abyss0End = moment(abyss0Start).add(14, 'days').format(f)
    let abyssB1Start = moment(abyss0Start).subtract(14, 'days').format(f)
    let abyssB1End = moment(abyssB1Start).add(14, 'days').format(f)

    let title1 = '「剧变节点」'
    let title2 = '「危局强袭」'
    let exchange = false
    let diff = newAbyssStart.diff(abyss0Start, 'days')
    if (diff % 14 === 0) {
      exchange = true
    }
    if (exchange) {
      [title1, title2] = [title2, title1]
    }

    check.push([moment(abyssB1Start), moment(abyssB1End), title1])
    check.push([moment(abyss0Start), moment(abyss0End), title2])
    check.push([moment(abyss1Start), moment(abyss1End), title1])
    check.push([moment(abyss2Start), moment(abyss2End), title2])
    check.push([moment(abyss3Start), moment(abyss3End), title1])
    check.push([moment(abyss4Start), moment(abyss4End), title2])
    check.push([moment(abyss5Start), moment(abyss5End), title1])

    let ret = []
    lodash.forEach(check, (ds) => {
      let [s2, e2] = ds
      let now = moment()
      if ((s2 <= now && now <= e2) || (now <= s2 && s2 <= e1)) {
        ret.push(ds)
      }
    })
    return ret
  },

  getList(ds, target, { startTime, endTime, totalRange, now, timeMap = {}, gachaImgs = [] }) {
    let type = ds.abyssType ? ds.abyssType : 'activity'
    let id = ds.ann_id
    let title = ds.title
    let banner = ds.banner
    let extra = { sort: 5 }
    let detail = timeMap[id] || {}
    //也就是说，这里的detail是从timeMap里边来的
    //试试输出title，看看里面有什么
    //logger.info(`getList输出:${ds.subtitle}`)

    //去掉标签
    title = title.replace(/(<|&lt;)[\w "%:;=\-\\/\\(\\),\\.]+(>|&gt;)/g, '')
    title = title.replace(/(&amp;)/g, '&')
    title = title.replace(/(调频说明|调频公告)/g, '调频')
    title = title.replace(/(活动说明|活动公告)/g, '活动')
    title = title.replace(/(上新说明|上新公告)/g, '上新')
    title = title.replace(/(」说明|」公告)/g, '」')
    if (/预下载/.test(title)) {
      title = '新版本预下载开启'
    }

    if (!title || ignoreIds.includes(id) || ignoreReg.test(title)) {
      return true
    }
    if (/(喧哗奏鸣)/.test(title)) {
      type = 'weapon'
      extra.sort = 2
      banner = gachaImgs.shift()
    }else if (/灿烂和声/.test(title)) {
        type = 'weapon2'
        extra.sort = 3
        banner = gachaImgs.shift()
    } else if (/调频/.test(title)) {
      //从角色池排除武器池
      if (/(喧哗奏鸣|灿烂和声)/.test(title)) {
        return
      }
      type = 'character'
      extra.sort = 1
      banner = gachaImgs.shift()
    } else if (/卓越搭档/.test(title)) {
      //邦布池
      type = 'bangboo'
      extra.sort = 4
      banner = gachaImgs.shift()
    } else if (/丽都城募/.test(title)) {
      type = 'pass'
    }

    let getDate = (d1, d2) => moment(d1 && d1.length > 6 ? d1 : d2)
    let sDate = getDate(detail.start, ds.start_time)
    let eDate = getDate(detail.end, ds.end_time)
    let sTime = moment.max(sDate, startTime)
    let eTime = moment.min(eDate, endTime)

    let sRange = sTime - startTime
    let eRange = eTime - startTime

    let left = sRange / totalRange * 100
    let width = eRange / totalRange * 100 - left

    let label = ''
    if (eDate - sDate > 365 * 24 * 3600 * 1000) {
      if (sDate < now) {
        label = sDate.format('MM-DD HH:mm') + ' 后永久有效'
      } else {
        label = sDate.format('MM-DD HH:mm') + ' (' + moment.duration(sDate - now).humanize() + '后开始)'
      }
    } else if (now > sDate && eDate > now) {
      label = eDate.format('MM-DD HH:mm') + ' (' + moment.duration(eDate - now).humanize() + '后结束)'
      if (width > 38) {
        label = sDate.format('MM-DD HH:mm') + ' ~ ' + label
      }
    } else if (sDate > now) {
      label = sDate.format('MM-DD HH:mm') + ' (' + moment.duration(sDate - now).humanize() + '后开始)'
    } else if (now > eDate) {
      label = sDate.format('MM-DD HH:mm') + ' (' + moment.duration(now - eDate).humanize() + '前已结束)'
    } else {
      label = sDate.format('MM-DD HH:mm') + ' ~ ' + eDate.format('MM-DD HH:mm')
    }
    if (sDate <= endTime && eDate >= startTime) {
      target.push({
        ...extra,
        id,
        title,
        type,
        mergeStatus: ['activity'].includes(type) ? 1 : 0,
        banner,
        icon: ds.tag_icon,
        left,
        width,
        label,
        duration: eTime - sTime,
        start: sDate.format('MM-DD HH:mm'),
        end: eDate.format('MM-DD HH:mm')
      })
    }
  },

  async get() {
    moment.locale('zh-cn')
    let now = moment()

    let { listData, detailData, timeMap, gachaImgs } = await CalZZZ.reqCalData()
    let dateList = Calendar.getDateList()

    let resultList = []
    let abyss = []

    //下面一行的原代码lodash.forEach(listData.data.list[0].list, (ds) => CalZZZ.getList(ds, resultList, { ...dateList, now, timeMap, gachaImgs }))
    lodash.forEach(listData.data.list[1].list, (ds) => CalZZZ.getList(ds, resultList, { ...dateList, now, timeMap, gachaImgs }))
    lodash.forEach(listData.data.list[0].list, (ds) => CalZZZ.getList(ds, resultList, { ...dateList, now, timeMap, gachaImgs }))
    //这行代码将会影响getList获取游戏公告还是活动公告
    //lodash.forEach(listData.data.pic_list[0].type_list[0].list, (ds) => CalZZZ.getList(ds, resultList, { ...dateList, now, timeMap, gachaImgs }))

    let versionStartTime
    lodash.forEach(listData.data.list[0].list, (ds) => {
      if (/版本(.*)更新(概览|说明)/.test(ds.subtitle)) {
        versionStartTime = ds.start_time
      }
    })

    let abyssCal = CalZZZ.getAbyssCal(dateList.startTime, dateList.endTime, versionStartTime)
    lodash.forEach(abyssCal, (t) => {
      CalZZZ.getList({
        title: t[2],
        start_time: t[0].format('YYYY-MM-DD HH:mm'),
        end_time: t[1].format('YYYY-MM-DD HH:mm'),
        abyssType: t[2] === '「剧变节点」' ? 'abyss-1' : 'abyss-2'
      }, abyss, { ...dateList, now })
    })

    resultList = lodash.sortBy(resultList, ['sort', 'start', 'duration'])

    let charCount = 0
    let charOld = 0
    let weaponCount = 0
    let weaponOld = 0
    let bangbooCount = 0
    let bangbooOld = 0
    let ret = []
    lodash.forEach(resultList, (li) => {
      if (li.type === 'character') {
        charCount++
        li.left === 0 && charOld++
        li.idx = charCount
      }
      if (li.type === 'weapon') {
        weaponCount++
        li.left === 0 && weaponOld++
        li.idx = weaponCount
      }
      if (li.type === 'bangboo') {
        bangbooCount++
        li.left === 0 && bangbooOld++
        li.idx = bangbooCount
      }
      if (li.mergeStatus === 1) {
        lodash.forEach(resultList, (li2) => {
          if (li2.mergeStatus === 1 && li.left + li.width <= li2.left) {
            li.mergeStatus = 2
            li2.mergeStatus = 2
            ret.push([li, li2])
            return false
          }
        })
      }
      if (li.mergeStatus !== 2) {
        li.mergeStatus = 2
        ret.push([li])
      }
    })

    return {
      game: 'zzz',
      ...dateList,
      list: ret,
      abyss,
      charMode: `char-${charCount}-${charOld}`,
      weaponMode: `weapon-${weaponCount}-${weaponOld}`,
      nowTime: now.format('YYYY-MM-DD HH:mm'),
      nowDate: now.date()
    }
  },

  async render(e) {
    //是否启用此日历
    let calEnable = true
    if (!calEnable) {
      return false;
    }
    let calData = await CalZZZ.get()
    let mode = 'calendar'
    if (/(日历列表|活动)$/.test(e.msg)) {
      mode = 'list'
    }

    return await Common.render('wiki/calendar', {
      ...calData,
      displayMode: mode
    }, { e, scale: 1.1 })
  }
}

export default CalZZZ
