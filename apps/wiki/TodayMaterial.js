import moment from 'moment'
import lodash from 'lodash'
import { Player, Material, Weapon, MysApi } from '#miao.models'
import { Common } from '#miao'

const TodayMaterial = {

  async render (e) {
    let now = moment(new Date())
    if (now.hour() < 4) {
      now = now.add(-1, 'days')
    }
    let week = now.weekday()
    if (week === 6) {
      e.reply('今天周日，全部素材都可以刷哦~')
      return false
    }
    week = week % 3 + 1
    let data = await TodayMaterial.getData(e, week)

    let uid = e.uid

    if (!data) {
      e._isReplyed || e.reply(`查询失败，暂未获得#${uid}角色数据，请绑定CK或 #更新面板`)
      return true
    }

    return await Common.render('wiki/today-material', {
      uid,
      data
    }, { e, scale: 1.1 })
  },

  async getData (e, week) {
    let mys = await MysApi.init(e)
    if (!mys || !mys.uid) return false

    let player = Player.create(e)
    // 刷新数据
    await player.refresh({
      detail: 1,
      talent: 1
    })

    let citys = {}
    let count = 0
    // 添加素材方法
    let addMaterial = (name, data, sortFn = (d) => d.id) => {
      let mat = Material.get(name)
      if (!mat || mat.week * 1 !== week) {
        return true
      }
      let { city, cid, type } = mat

      // 如果没有城市数据，则创建
      if (!citys[cid]) {
        citys[cid] = {
          city,
          week: mat.week,
          talent: {},
          weapon: {}
        }
      }
      let curr = citys[cid][type]
      // 如果没有材料信息，则补充
      if (!curr?.material) {
        let mData = mat.getData('name,city,source,icon')
        let tmp = []
        lodash.forEach(mat.items, (n) => {
          let starMat = Material.get(n)
          tmp.push(starMat.icon)
        })
        mData.icons = tmp.reverse()
        curr.material = mData
        curr.data = []
      }

      // 获取排序字段
      let sortArr = sortFn(data)
      let sort = 0
      for (let i = 0; i <= 3; i++) {
        sort += sortArr[i] * 10 ** (6 - 2 * i)
      }
      // 如果已经满，则排序靠后
      if (data.isMax) {
        sort = sort - 10 ** 8
      }
      data.sort = sort

      // done
      curr.data.push(data)
    }

    player.forEachAvatar((avatar) => {
      count++
      let { char, weapon, talent } = avatar

      // 添加天赋素材
      addMaterial(char?.materials?.talent, {
        ...char.getData('id,name,face,star'),
        ...avatar.getData('level,cons'),
        talent,
        isMax: avatar.isMaxTalent
      }, (d) => [d.level, d.star, d.cons, d.id - 10000000])

      // 添加武器素材
      let wData = Weapon.get(weapon.name)
      addMaterial(wData?.materials?.weapon, {
        ...wData.getData('id,abbr,icon,star'),
        level: weapon.level,
        affix: weapon.affix,
        face: char.side,
        isMax: weapon.promote >= wData.maxPromote
      }, (d) => [d.level, d.star, d.affix, d.id / 100])
    })

    if (count === 0) {
      return false
    }

    let ret = []
    lodash.forEach(citys, (ds) => {
      ds.talent.data = lodash.orderBy(ds.talent?.data, ['sort']).reverse()
      ds.weapon.data = lodash.orderBy(ds.weapon?.data, ['sort']).reverse()
      ret.unshift(ds)
    })
    return ret
  }
}

export default TodayMaterial
