import Character from './Character.js'

export default class Button {
  constructor(e = {}) {
    this.prefix = e.isSr ? "*" : "#"
    this.charGame = e.isSr ? 'sr' : 'gs'
  }

  bindUid() {
    return segment.button([
      { text: "绑定UID", input: `${this.prefix}绑定uid` },
    ])
  }

  gacha() {
    return segment.button([
      { text: "角色记录", callback: `${this.prefix}角色记录` },
      { text: "角色统计", callback: `${this.prefix}角色统计` },
    ],[
      { text: "武器记录", callback: `${this.prefix}武器记录` },
      { text: "武器统计", callback: `${this.prefix}武器统计` },
    ],[
      { text: "常驻记录", callback: `${this.prefix}常驻记录` },
      { text: "常驻统计", callback: `${this.prefix}常驻统计` },
    ],[
      { text: "抽卡帮助", callback: `${this.prefix}抽卡帮助` },
    ])
  }

  profile(char = {}, uid = "") {
    // 按钮文字使用展示名，回调保留角色本名以精确定位面板数据
    const name = char.displayName || char.name
    const key = char.name
    return segment.button([
      { text: `${name}卡片`, callback: `${this.prefix}${key}卡片${uid}` },
      { text: `${name}面板`, callback: `${this.prefix}${key}面板${uid}` },
    ],[
      { text: `${name}排行`, callback: `${this.prefix}${key}排行` },
      { text: `${name}圣遗物`, callback: `${this.prefix}${key}圣遗物${uid}` },
    ],[
      { text: `${name}图鉴`, callback: `${this.prefix}${key}图鉴` },
      { text: `${name}攻略`, callback: `${this.prefix}${key}攻略` },
    ],[
      { text: `${name}命座`, callback: `${this.prefix}${key}命座` },
      { text: `${name}天赋`, callback: `${this.prefix}${key}天赋` },
    ])
  }

  profileList(uid = "", charList = {}) {
    const button = [[]]
    let count = 0
    for (const name in charList) {
      if (count >= 10) break 
      const array = button[button.length-1]
      // 按钮文字使用展示名，回调保留角色本名以精确定位面板数据
      let displayName = Character.get(name, this.charGame)?.displayName || name
      array.push({ text: `${displayName}面板`, callback: `${this.prefix}${name}面板${uid}` })
      if (array.length > 1)
        button.push([])
      count++
    }
    if (!button[0].length)
      button[0] = [
        { text: "更新面板", callback: `${this.prefix}更新面板${uid}` },
        { text: "删除面板", callback: `${this.prefix}删除面板${uid}` },
      ]
    return segment.button(...button)
  }
}
