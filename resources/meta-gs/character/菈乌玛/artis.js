import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({attr, rule, def}) {
    let title = []
    let particularAttr = {...usefulAttr['菈乌玛']}
    if (attr.cpct * 2 + attr.cdmg > 240) {
        title.push('战斗')
        particularAttr.atk = 50
        particularAttr.cpct = 100
        particularAttr.cdmg = 100
    }
    if (title.length > 0) {
        return rule(`菈乌玛-${title.join('')}`, particularAttr)
    }
    return def(usefulAttr['菈乌玛'])
}
