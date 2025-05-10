export default class Button {
  constructor(e = {}) {
    this.prefix = e.isSr ? "*" : "#"
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
    return segment.button([
      { text: `${char.name}卡片`, callback: `${this.prefix}${char.name}卡片${uid}` },
      { text: `${char.name}面板`, callback: `${this.prefix}${char.name}面板${uid}` },
    ],[
      { text: `${char.name}排行`, callback: `${this.prefix}${char.name}排行` },
      { text: `${char.name}圣遗物`, callback: `${this.prefix}${char.name}圣遗物${uid}` },
    ],[
      { text: `${char.name}图鉴`, callback: `${this.prefix}${char.name}图鉴` },
      { text: `${char.name}攻略`, callback: `${this.prefix}${char.name}攻略` },
    ],[
      { text: `${char.name}命座`, callback: `${this.prefix}${char.name}命座` },
      { text: `${char.name}天赋`, callback: `${this.prefix}${char.name}天赋` },
    ])
  }

  profileList(uid = "", charList = {}) {
    const button = [[]]
    let count = 0
    for (const name in charList) {
      if (count >= 10) break 
      const array = button[button.length-1]
      array.push({ text: `${name}面板`, callback: `${this.prefix}${name}面板${uid}` })
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
