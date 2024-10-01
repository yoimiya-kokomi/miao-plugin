import { usefulAttr } from "../../artifact/artis-mark.js"

export default function ({ cons, rule, def }) {
    if (cons === 6) {
        let particularAttr = JSON.parse(JSON.stringify(usefulAttr['芙宁娜']));
        particularAttr.mastery = 45;
        return rule('芙宁娜-满命', particularAttr);
    }
    return def(usefulAttr['芙宁娜']);
}
