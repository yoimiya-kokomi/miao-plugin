/*
* 此配置文件为系统使用，请勿修改，否则可能无法正常使用
*
* 如需自定义配置请复制修改上一级gacha_default.js
*
* */

export const luckCfg = {
  // 是否在【#抽卡记录】中显示欧皇度
  enable: true,

  // 各卡池出金概率模型（官方公示基础概率 + 社区统计的软保底）
  // base：基础概率；soft：从第几抽开始概率提升；step：之后每抽提升的概率；hard：硬保底抽数
  // upRate：小保底不歪的概率，常驻/集录池不填
  // 按此模型：角色池单个五星期望约62.3抽，82抽内出金概率约98%
  model: {
    gs: {
      301: { base: 0.006, soft: 74, step: 0.06, hard: 90, upRate: 0.55 }, // 角色池：捕获明光后小保底约55%不歪
      302: { base: 0.007, soft: 63, step: 0.07, hard: 80, upRate: 0.75 }, // 武器池：75%为UP武器
      200: { base: 0.006, soft: 74, step: 0.06, hard: 90 }, // 常驻池
      500: { base: 0.006, soft: 74, step: 0.06, hard: 90 } // 集录池
    },
    sr: {
      11: { base: 0.006, soft: 74, step: 0.06, hard: 90, upRate: 0.5 }, // 角色池
      12: { base: 0.008, soft: 66, step: 0.07, hard: 80, upRate: 0.75 }, // 光锥池
      1: { base: 0.006, soft: 74, step: 0.06, hard: 90 } // 常驻池
    }
  },

  // 评级：运气超过的玩家比例(%) >= min 时命中，从上到下依次判断
  levels: [
    { min: 99, title: '天运所归', desc: '天选之人，建议去买彩票', color: '#ff7a1f' },
    { min: 95, title: '终极欧皇', desc: '金光常伴左右', color: '#ff9f1f' },
    { min: 85, title: '大欧皇', desc: '运气远超常人', color: '#f5b72a' },
    { min: 70, title: '小欧皇', desc: '运气明显好于平均', color: '#e4c46a' },
    { min: 55, title: '小有运气', desc: '运气略好于平均', color: '#c9cf8a' },
    { min: 45, title: '平民', desc: '和理论期望相当', color: '#a8c1d8' },
    { min: 25, title: '小非酋', desc: '运气略差于平均', color: '#8f9bd6' },
    { min: 8, title: '大非酋', desc: '保底常客', color: '#9a76d8' },
    { min: 0, title: '终极非酋', desc: '抱抱，下次一定出金', color: '#b0526a' }
  ],

  // 有效样本（UP数 / 五星数）少于该值时提示“样本较少”
  minSample: 3
}

// 【#抽卡记录】图片设置
export const detailCfg = {
  // 最多显示的五星记录条数（不含“已抽”），超出的不显示，但统计数据仍包含全部记录
  // 记录过多时图片太长可能无法发送；0 为不限制
  maxLog: 30
}

// 【#抽卡统计】【#角色统计】等图片设置
export const statCfg = {
  // 每张图最多显示的卡池期数，超出的部分：#角色统计 不显示，#角色全部统计 分多张图合并转发
  // 顶部统计仍包含全部数据；0 为不限制
  maxVersion: 10
}

export const isSys = true
