import lodash from 'lodash'
import { Data } from '#miao'
import { Character, Weapon } from '#miao.models'
import { poolDetail } from '../../resources/meta-gs/info/index.js'
import moment from 'moment'

let poolVersion = []
lodash.forEach(poolDetail, (ds) => {
  poolVersion.push({
    ...ds,
    start: new Date(ds.from),
    end: new Date(ds.to)
  })
})
let last = poolVersion[poolVersion.length - 1]
// 为未知卡池做兼容
poolVersion.push({
  version: '新版本',
  half: '?',
  from: last.to,
  to: '2025-12-31 23:59:59',
  start: last.end,
  end: new Date('2025-12-31 23:59:59')
})

let GachaData = {

  // 获取JSON数据
  readJSON (qq, uid, type) {
    let logJson = []
    // 获取本地数据 进行数据合并
    logJson = Data.readJSON(`/data/gachaJson/${qq}/${uid}/${type}.json`, 'root')
    let itemMap = {}
    let nameMap = {}
    let items = []
    let ids = {}
    lodash.forEach(logJson, (ds) => {
      if (!nameMap[ds.name]) {
        if (ds.item_type === '武器') {
          let weapon = Weapon.get(ds.name)
          if (weapon) {
            nameMap[ds.name] = weapon.id
            itemMap[weapon.id] = {
              type: 'weapon',
              count: 0,
              ...weapon.getData('star,name,abbr,img')
            }
          } else {
            nameMap[ds.name] = 403
            itemMap[403] = {
              type: 'weapon',
              count: 0,
              star: 3,
              name: '未知',
              abbr: '未知',
              img: ''
            }
          }
        } else if (ds.item_type === '角色') {
          let char = Character.get(ds.name)
          if (char) {
            nameMap[ds.name] = char.id
            itemMap[char.id] = {
              type: 'char',
              count: 0,
              ...char.getData('star,name,abbr,img:face')
            }
          } else {
            nameMap[ds.name] = 404
            itemMap[404] = {
              type: 'char',
              count: 0,
              star: 4,
              name: '未知',
              abbr: '未知',
              img: ''
            }
          }
        }
      }
      let id = nameMap[ds.name]
      if (!id || !itemMap[id] || (ds.id && ids[ds.id])) {
        return true
      }
      ids[ds.id] = true
      items.push({
        id,
        logId: ds.id,
        time: new Date(ds.time)
      })
    })
    items = items.sort((a, b) => b.time - a.time)
    return { items, itemMap }
  },

  // 卡池分析
  analyse (qq, uid, type) {
    let logData = GachaData.readJSON(qq, uid, type)
    let fiveLog = []
    let fourLog = []
    let fiveNum = 0
    let fourNum = 0
    let fiveLogNum = 0
    let fourLogNum = 0
    let noFiveNum = 0
    let noFourNum = 0
    let wai = 0 // 歪
    let weaponNum = 0
    let weaponFourNum = 0
    let bigNum = 0
    let allNum = 0

    let itemMap = logData.itemMap
    if (logData.items.length === 0) {
      return false
    }
    let currVersion
    lodash.forEach(logData.items, (item) => {
      if (!currVersion || (item.time < currVersion.start)) {
        currVersion = GachaData.getVersion(item.time)
      }

      allNum++
      let ds = itemMap[item.id]
      let { star, type } = ds
      ds.count++
      if (star === 4) {
        fourNum++
        if (noFourNum === 0) {
          noFourNum = fourLogNum
        }
        fourLogNum = 0
        if (fourLog[ds.name]) {
          fourLog[ds.name]++
        } else {
          fourLog[ds.name] = 1
        }
        if (type === 'weapon') {
          weaponFourNum++
        }
      }
      fourLogNum++

      if (star === 5) {
        fiveNum++
        if (fiveLog.length > 0) {
          fiveLog[fiveLog.length - 1].count = fiveLogNum
        } else {
          noFiveNum = fiveLogNum
        }
        fiveLogNum = 0
        let isUp = false
        // 歪了多少个
        if (type === 'char') {
          if (currVersion.char5?.includes(ds.name)) {
            isUp = true
          } else {
            wai++
          }
        } else {
          if (currVersion.weapon5?.includes(ds.name)) {
            isUp = true
          } else {
            wai++
          }
        }

        fiveLog.push({
          id: item.id,
          isUp,
          date: moment(item.time).format('MM-DD')
        })
      }
      fiveLogNum++
    })

    if (fiveLog.length > 0) {
      fiveLog[fiveLog.length - 1].count = fiveLogNum
    } else {
      // 没有五星
      noFiveNum = allNum
    }

    // 四星最多
    let fourItem = lodash.filter(lodash.values(itemMap), (ds) => ds.star === 4)
    fourItem.push({ name: '无', count: 0 })
    fourItem = fourItem.sort((a, b) => b.count - a.count)

    // 平均5星
    let fiveAvg = 0
    let fourAvg = 0
    if (fiveNum > 0) {
      fiveAvg = ((allNum - noFiveNum) / fiveNum).toFixed(2)
    }
    // 平均四星
    if (fourNum > 0) {
      fourAvg = ((allNum - noFourNum) / fourNum).toFixed(2)
    }

    // 有效抽卡
    let isvalidNum = 0
    if (fiveNum > 0 && fiveNum > wai) {
      if (fiveLog.length > 0 && !fiveLog[0].isUp) {
        isvalidNum = (allNum - noFiveNum - fiveLog[0].count) / (fiveNum - wai)
      } else {
        isvalidNum = (allNum - noFiveNum) / (fiveNum - wai)
      }
      isvalidNum = isvalidNum.toFixed(2)
    }

    let upYs = isvalidNum * 160
    if (upYs >= 10000) {
      upYs = (upYs / 10000).toFixed(2) + 'w'
    } else {
      upYs = upYs.toFixed(0)
    }

    // 小保底不歪概率
    let noWaiRate = 0
    if (fiveNum > 0) {
      noWaiRate = (fiveNum - bigNum - wai) / (fiveNum - bigNum)
      noWaiRate = (noWaiRate * 100).toFixed(1)
    }

    if (noFiveNum > 0) {
      fiveLog.unshift({
        id: 888,
        isUp: true,
        count: noFiveNum,
        date: moment().format('MM-DD')
      })
      itemMap['888'] = {
        name: '已抽',
        star: 5,
        abbr: '已抽',
        img: 'gacha/imgs/no-avatar.webp'
      }
    }

    return {
      stat: {
        allNum,
        noFiveNum,
        noFourNum,
        fiveNum,
        fourNum,
        fiveAvg,
        fourAvg,
        wai,
        isvalidNum,
        weaponNum,
        weaponFourNum,
        upYs
      },
      maxFour: fourItem[0],
      fiveLog,
      noWaiRate,
      items: itemMap
    }
  },

  // 卡池统计
  stat (qq, uid, type) {
    let items = []
    let itemMap = {}
    let hasVersion = true
    let loadData = function (poolId) {
      let gachaData = GachaData.readJSON(qq, uid, poolId)
      items = items.concat(gachaData.items)
      lodash.extend(itemMap, gachaData.itemMap || {})
    }
    if (['up', 'char', 'all'].includes(type)) {
      loadData(301)
    }
    if (['up', 'weapon', 'all'].includes(type)) {
      loadData(302)
    }
    if (['all', 'normal'].includes(type)) {
      hasVersion = false
      loadData(200)
    }

    items = items.sort((a, b) => b.time - a.time)

    let versionData = []
    let currVersion

    if (lodash.isEmpty(items)) {
      return false
    }

    let getCurr = function () {
      if (currVersion && !lodash.isEmpty(currVersion)) {
        let cv = currVersion
        let temp = {
          version: cv.version,
          half: cv.half,
          from: hasVersion ? moment(new Date(cv.from)).format('YY-MM-DD') : '',
          to: hasVersion ? moment(new Date(cv.to)).format('YY-MM-DD') : '',
          upIds: {}
        }
        let upName = {}
        let items = []
        let poolNames = []
        lodash.forEach(cv.char5, (name) => {
          upName[name] = true
          let char = Character.get(name)
          poolNames.push(char.abbr)
        })
        lodash.forEach(cv.weapon5, (name) => {
          upName[name] = true
        })
        let w5Num = 0
        let w5UpNum = 0
        let c5Num = 0
        let c5UpNum = 0
        let c4Num = 0
        let w4Num = 0
        let w3Num = 0
        lodash.forEach(cv.items, (num, id) => {
          let item = itemMap[id]
          let isUp = upName[item.name]
          let star = item.star
          if (isUp) {
            temp.upIds[id] = item.name
          }
          items.push({ id, num, star: item.star, isUp: temp.upIds[id] ? 1 : 0 })
          if (item.type === 'char') {
            if (star === 5) {
              c5Num += num
              isUp && (c5UpNum += num)
            } else {
              c4Num += num
            }
          }
          if (item.type === 'weapon') {
            if (star === 5) {
              w5Num += num
              isUp && (w5UpNum += num)
            } else {
              star === 4 ? (w4Num += num) : (w3Num += num)
            }
          }
        })
        temp.name = poolNames.join(' / ')
        temp.items = lodash.sortBy(items, ['star', 'num', 'isUp']).reverse()
        temp.stats = {
          w5Num,
          w5UpNum,
          c5Num,
          c5UpNum,
          c4Num,
          w4Num,
          w3Num,
          upNum: w5UpNum + c5UpNum,
          star5Num: w5Num + c5Num,
          star4Num: w4Num + c4Num,
          totalNum: w5Num + w4Num + w3Num + c5Num + c4Num
        }
        return temp
      }
    }

    lodash.forEach(items, (ds) => {
      if (!currVersion || (ds.time < currVersion.start && hasVersion)) {
        if (currVersion) {
          versionData.push(getCurr())
        }
        let v = GachaData.getVersion(ds.time, hasVersion)
        if (!hasVersion) {
          v.version = type === 'all' ? '全部统计' : '常驻池'
        }
        if (!v) {
          return true
        }
        currVersion = {
          ...v,
          items: {}
        }
      }
      if (!currVersion.items[ds.id]) {
        currVersion.items[ds.id] = 1
      } else {
        currVersion.items[ds.id]++
      }
    })
    versionData.push(getCurr())

    let stat = {}
    lodash.forEach(versionData, (ds) => {
      lodash.forEach(ds.stats, (num, key) => {
        if (!stat[key]) {
          stat[key] = num
        } else {
          stat[key] += num
        }
      })
    })
    stat.avgUpNum = stat.upNum === 0 ? 0 : ((stat.totalNum / stat.upNum).toFixed(1))

    return {
      versionData,
      itemMap,
      totalStat: stat
    }
  },

  getVersion (time, hasVersion = true) {
    if (hasVersion) {
      for (let ds of poolVersion) {
        if (time > ds.start && time < ds.end) {
          return ds
        }
      }
    }
    return {
      version: hasVersion === false ? '全部' : '未知',
      half: '',
      char5: [],
      char4: [],
      weapon5: [],
      weapon4: []
    }
  },

  getItem (ds) {
    if (ds.item_type === '武器') {
      let weapon = Weapon.get(ds.name)
      return {
        type: 'weapon',
        count: 0,
        ...weapon.getData('id,star,name,abbr,img')
      }
    } else if (ds.item_type === '角色') {
      let char = Character.get(ds.name)
      return {
        type: 'char',
        count: 0,
        ...char.getData('id,star,name,abbr,face')
      }
    }
  }
}
export default GachaData
