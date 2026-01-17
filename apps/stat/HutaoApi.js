/*
* 胡桃API & 统计数据源 Miao-Plugin 封装
* */

import fetch from "node-fetch"
import lodash from "lodash"
import { Data } from "#miao"
import { Character } from "#miao.models"

// 暂时留着占位
const host = "http://miao.games/api/hutao"
const commonUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

const getApi = (api) => `${host}?api=${api}`

// API请求处理
async function fetchExternal(url, sourceName) {
  try {
    let response = await fetch(url, { headers: { "User-Agent": commonUA } })
    if (!response.ok) {
      console.error(`${sourceName} API Error: ${response.status} ${response.statusText}`)
      return null
    }
    let text = await response.text()
    try {
      return JSON.parse(text)
    } catch (e) {
      // 从文本中提取 JSON
      let start = text.indexOf("{")
      let end = text.lastIndexOf("}")
      if (start !== -1 && end !== -1) {
        return JSON.parse(text.substring(start, end + 1))
      }
    }
  } catch (e) {
    console.error(`${sourceName} JSON Parse/Fetch Error`, e)
  }
  return null
}

let HutaoApi = {
  async req(url, param = {}, EX = 3600) {
    let cacheKey = `miao:hutao:${url}`
    let cacheData = await Data.getCacheJSON(cacheKey)
    if (cacheData && cacheData.data && param.method !== "POST") return cacheData

    let response = await fetch(getApi(`${url}`), {
      ...param,
      method: param.method || "GET"
    })
    let retData = await response.json()
    
    if (retData && retData.data && param.method !== "POST") {
      let d = new Date()
      retData.lastUpdate = `${d.toLocaleDateString()} ${d.toTimeString().substr(0, 5)}`
      await Data.setCacheJSON(cacheKey, retData, EX)
    }
    return retData
  },

  async getOverview() {
    return await HutaoApi.req("/Statistics/Overview")
  },

  async uploadData(data = {}) {
    return await HutaoApi.req("/Record/UploadData", {
      method: "POST",
      headers: {
        "User-Agent": "Yunzai-Bot/Miao-Plugin",
        "Content-Type": "text/json; charset=utf-8"
      },
      body: JSON.stringify(data)
    })
  },

  /** 获取角色持有率及命座分布 */
  async getCons() {
    let lelaerData = await HutaoApi.getLelaerData()
    if (!lelaerData) return {}

    let abyssData = await HutaoApi.getYshelperAbyssRank()
    let ownMap = {}
    if (abyssData && abyssData.has_list) {
      lodash.forEach(abyssData.has_list, (ds) => {
        let char = Character.get(ds.name)
        if (char) ownMap[char.id] = ds.own_rate
      })
    }

    let ret = []
    let totalCount = lelaerData.totalCount || 0

    lodash.forEach(lelaerData.data, (ds, charId) => {
      let rate = []
      for (let i = 0; i <= 6; i++) {
        rate.push({ id: i, value: (ds[`c${i}`] || 0) / 100 })
      }
      
      let holdingRate = ownMap[charId]
      if (holdingRate) {
        holdingRate = holdingRate / 100
      } else {
        holdingRate = null
      }

      ret.push({
        avatar: Number(charId),
        holdingRate,
        avgLevel: ds.avg_level,
        avgCons: ds.avg_class,
        rate
      })
    })

    return {
      lastUpdate: lelaerData.lastUpdate,
      totalCount,
      data: ret
    }
  },

  /** 获取角色使用数据 */
  async getUsage() {
    let lelaerData = await HutaoApi.getLelaerData()
    return { data: lelaerData?.data || {} }
  },

  /** 获取角色统计数据 */
  async getLelaerData() {
    let cacheKey = "miao:lelaer:roleAvg"
    let cacheData = await Data.getCacheJSON(cacheKey)
    if (cacheData && cacheData.totalCount) return cacheData

    let data = await fetchExternal("https://api.lelaer.com/ys/getRoleAvg.php?star=all&lang=zh-Hans", "Lelaer")
    
    if (data && data.result) {
      let charData = {}
      let totalCount = 0
      
      lodash.forEach(data.result, (ds) => {
        let char = Character.get(ds.role)
        if (char) {
          charData[char.id] = ds
          if (ds.role_sum > totalCount) totalCount = ds.role_sum
        }
      })

      let ret = {
        lastUpdate: data.last_update,
        totalCount,
        data: charData
      }
      await Data.setCacheJSON(cacheKey, ret, 3600)
      return ret
    }
    return null
  },

  /** 获取幽境统计数据 */
  async getLelaerAbyssRank2() {
    let cacheKey = "miao:lelaer:abyssRank2"
    let cacheData = await Data.getCacheJSON(cacheKey)
    if (cacheData && cacheData.result) return cacheData

    let data = await fetchExternal("https://api.lelaer.com/ys/getAbyssRank2.php?star=all&role=all&lang=zh-Hans", "LelaerAbyss")
    
    if (data && data.result) {
      await Data.setCacheJSON(cacheKey, data, 3600)
      return data
    }
    return null
  },

  /** 获取深渊组队数据 */
  async getAbyssTeam() {
    let abyssData = await HutaoApi.getYshelperAbyssRank()
    if (!abyssData || !abyssData.result || !abyssData.has_list) return {}

    let urlMap = {}
    lodash.forEach(abyssData.has_list, (ds) => {
      let char = Character.get(ds.name)
      if (char) urlMap[ds.avatar] = char.id
    })

    let teamList = null
    if (lodash.isArray(abyssData.result)) {
      for (let list of abyssData.result) {
        if (lodash.isArray(list) && list.length > 0 && list[0].role && lodash.isArray(list[0].role)) {
          teamList = list
          break
        }
      }
    }

    if (!teamList) return { data: [] }

    let floorData = { floor: 12, up: [], down: [] }
    lodash.forEach(teamList, (ds) => {
      let teamIds = []
      lodash.forEach(ds.role, (role) => {
        if (urlMap[role.avatar]) teamIds.push(urlMap[role.avatar])
      })

      if (teamIds.length > 0) {
        let item = teamIds.join(",")
        if (ds.up_use_num > 0) floorData.up.push({ item, rate: ds.up_use_num })
        if (ds.down_use_num > 0) floorData.down.push({ item, rate: ds.down_use_num })
      }
    })

    return { data: [floorData] }
  },

  /** 获取深渊统计数据 */
  async getYshelperAbyssRank() {
    let cacheKey = "miao:yshelper:abyssRank:v2"
    let cacheData = await Data.getCacheJSON(cacheKey)
    if (cacheData && cacheData.result) return cacheData

    let data = await fetchExternal("https://api.yshelper.com/ys/getAbyssRank.php?star=all&role=all&lang=zh-Hans", "Yshelper")
    
    if (data && data.result) {
      await Data.setCacheJSON(cacheKey, data, 3600)
      return data
    }
    return null
  }
}

export default HutaoApi
