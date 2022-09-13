/*
* V3版Yunzai plugin
* */
let stateArr = {}

export default class plugin {
  /**
   * @param name 插件名称
   * @param dsc 插件描述
   * @param event 执行事件，默认message
   * @param priority 优先级，数字越小优先级越高
   * @param rule.reg 命令正则
   * @param rule.fnc 命令执行方法
   * @param rule.event 执行事件，默认message
   * @param rule.log  false时不显示执行日志
   * @param rule.permission 权限 master,owner,admin,all
   * @param task.name 定时任务名称
   * @param task.cron 定时任务cron表达式
   * @param task.fnc 定时任务方法名
   * @param task.log  false时不显示执行日志
   */
  constructor (data) {
    /** 插件名称 */
    this.name = data.name
    /** 插件描述 */
    this.dsc = data.dsc
    /** 监听事件，默认message https://oicqjs.github.io/oicq/#events */
    this.event = data.event || 'message'
    /** 优先级 */
    this.priority = data.priority || 5000
    /** 定时任务，可以是数组 */
    this.task = {
      /** 任务名 */
      name: '',
      /** 任务方法名 */
      fnc: data.task?.fnc || '',
      /** 任务cron表达式 */
      cron: data.task?.cron || ''
    }

    /** 命令规则 */
    this.rule = data.rule || []
  }

  /**
   * @param msg 发送的消息
   * @param quote 是否引用回复
   * @param data.recallMsg 群聊是否撤回消息，0-120秒，0不撤回
   * @param data.at 是否at用户
   */
  reply (msg = '', quote = false, data = {}) {
    if (!this.e.reply || !msg) return false
    return this.e.reply(msg, quote, data)
  }

  conKey (isGroup = false) {
    if (isGroup) {
      return `${this.name}.${this.e.group_id}`
    } else {
      return `${this.name}.${this.userId || this.e.user_id}`
    }
  }

  /**
   * @param type 执行方法
   * @param isGroup 是否群聊
   * @param time 操作时间，默认120秒
   */
  setContext (type, isGroup = false, time = 120) {
    let key = this.conKey(isGroup)
    if (!stateArr[key]) stateArr[key] = {}
    stateArr[key][type] = this.e
    if (time) {
      /** 操作时间 */
      setTimeout(() => {
        if (stateArr[key][type]) {
          delete stateArr[key][type]
          this.e.reply('操作超时已取消', true)
        }
      }, time * 1000)
    }
  }

  getContext () {
    let key = this.conKey()
    return stateArr[key]
  }

  getContextGroup () {
    let key = this.conKey(true)
    return stateArr[key]
  }

  /**
   * @param type 执行方法
   * @param isGroup 是否群聊
   */
  finish (type, isGroup = false) {
    if (stateArr[this.conKey(isGroup)] && stateArr[this.conKey(isGroup)][type]) {
      delete stateArr[this.conKey(isGroup)][type]
    }
  }
}
