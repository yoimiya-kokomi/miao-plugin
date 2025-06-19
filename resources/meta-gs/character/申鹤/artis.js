import {usefulAttr} from "../../artifact/artis-mark.js"

export default function ({cons, rule, def}) {
    let title = []
    let particularAttr = {...usefulAttr['申鹤']}
    if (cons > 0) {
        title.push('高命')
        particularAttr.recharge = 75
    }
    if (title.length > 0) {
        return rule(`申鹤-${title.join('')}`, particularAttr)
    }
    return def(usefulAttr['申鹤'])
}
